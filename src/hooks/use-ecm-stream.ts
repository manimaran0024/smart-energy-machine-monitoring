import { useEffect, useRef, useState } from "react";
import type { Reading, AlertHistoryEntry } from "@/lib/ecm";
import { evaluateSystem } from "@/lib/ecm";
import { toast } from "sonner";

const MAX_HISTORY_POINTS = 60; // last ~5 minutes at 5s interval
const ALERT_EMAIL = "maranmani5318@gmail.com";

// Simulate ECM machine readings — alternates between safe / warning / critical phases
function simulateReading(prev: Reading | null, t: number): Reading {
  // Phase cycles every ~75s: 0-45 safe, 45-60 warning, 60-75 critical
  const phase = Math.floor((t / 1000) % 75);
  let baseTemp = 65, baseVolt = 225, baseCurr = 9, basePower = 2100;
  let fault = "NONE";
  let status: Reading["machineStatus"] = "RUNNING";

  if (phase >= 45 && phase < 60) {
    // warning — temp in 100–200 warning band, plus other params elevated
    baseTemp = 145; baseVolt = 245; baseCurr = 13.2; basePower = 2750;
  } else if (phase >= 60) {
    // critical — randomly trigger different parameters (temp > 200°C is critical)
    const which = Math.floor((t / 1000) % 4);
    baseTemp = which === 0 ? 215 : 160;
    baseVolt = which === 1 ? 262 : 238;
    baseCurr = which === 2 ? 16.2 : 11.5;
    basePower = which === 3 ? 3200 : 2400;
    if (which === 0 && Math.random() < 0.4) { fault = "F-204"; status = "FAULT"; }
  }

  const jitter = (n: number, j: number) => +(n + (Math.random() - 0.5) * j).toFixed(2);
  const runtimeHours = prev ? +(prev.runtimeHours + 5 / 3600).toFixed(3) : 1284.5;
  const energyToday = prev ? +(prev.energyToday + basePower / 3600 / 1000 * 5).toFixed(3) : 18.42;
  const energyWeek = prev ? +(prev.energyWeek + basePower / 3600 / 1000 * 5).toFixed(3) : 142.7;

  return {
    timestamp: t,
    temperature: jitter(baseTemp, 2),
    voltage: jitter(baseVolt, 1.5),
    current: jitter(baseCurr, 0.4),
    power: jitter(basePower, 60),
    runtimeHours,
    energyToday,
    energyWeek,
    faultCode: fault,
    machineStatus: status,
  };
}

export function useEcmStream() {
  const [current, setCurrent] = useState<Reading | null>(null);
  const [history, setHistory] = useState<Reading[]>([]);
  const [alerts, setAlerts] = useState<AlertHistoryEntry[]>([]);
  const lastLevelRef = useRef<string>("safe");

  useEffect(() => {
    let prev: Reading | null = null;
    const tick = () => {
      const reading = simulateReading(prev, Date.now());
      prev = reading;
      setCurrent(reading);
      setHistory((h) => [...h.slice(-(MAX_HISTORY_POINTS - 1)), reading]);

      const evalResult = evaluateSystem(reading);

      // Alerts ONLY fire when system becomes UNSAFE (critical) — never for warning, never repeatedly.
      // A new alert is logged only on the transition from non-critical → critical.
      if (evalResult.overall === "critical" && lastLevelRef.current !== "critical") {
        const now = Date.now();
        const recipient = ALERT_EMAIL;
        const entry: AlertHistoryEntry = {
          id: `${now}`,
          time: now,
          level: "critical",
          exceeded: evalResult.exceeded.map((e) => ({
            label: e.label, value: String(e.value), unit: e.unit, level: e.level,
          })),
          message: evalResult.message,
          emailSent: false,
          email: recipient,
        };

        const alertBackendUrl = import.meta.env.VITE_ALERT_BACKEND_URL || "https://ecm-mail-backend.vercel.app";
        fetch(`${alertBackendUrl}/send-alert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipient,
            subject: "ECM CRITICAL ALERT",
            text: `${evalResult.message}\n\nExceeded: ${evalResult.exceeded.map((e) => `${e.label}: ${e.value} ${e.unit}`).join(", ")}`
          })
        })
          .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
              throw new Error(data?.error || "Email send failed");
            }
            return data;
          })
          .then(() => {
            setAlerts((a) => [{ ...entry, emailSent: true }, ...a].slice(0, 50));
            toast.success("CRITICAL alert email dispatched", {
              description: `${evalResult.criticals.length} parameter(s) exceeded critical thresholds. Email sent to ${recipient}`,
            });
          })
          .catch((err) => {
            console.error("Email alert error:", err);
            setAlerts((a) => [entry, ...a].slice(0, 50));
            toast.error("Critical alert email failed", {
              description: `Unable to send alert email to ${recipient}. ${err?.message || "Check backend or network."}`,
            });
          });
      }

      lastLevelRef.current = evalResult.overall;
    };

    tick();
    const id = setInterval(tick, 2500);
    return () => clearInterval(id);
  }, []);

  return { current, history, alerts };
}
