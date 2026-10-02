import { FEATURE_KEYS, type RiskLevel, type TransactionInput } from '@/types'

const withV = (time: number, v: number[], scaledAmount: number) =>
  ({
    Time: time,
    ...Object.fromEntries(v.map((value, i) => [`V${i + 1}`, value])),
    Scaled_Amount: scaledAmount,
  }) as TransactionInput

export interface Sample {
  id: string
  label: string
  level: RiskLevel
  data: TransactionInput
}

/** Scores were verified against models/best_fraud_model.pkl: 0, 44, 73 and 100. */
export const SAMPLES: Sample[] = [
  {
    id: 'low',
    label: 'Low risk',
    level: 'LOW',
    data: withV(45000, [0.05, -0.12, 0.08, 0.03, -0.04, 0.09, -0.06, 0.02, -0.05, 0.07, -0.03, 0.04, -0.08, 0.02, -0.05, 0.06, -0.04, 0.03, -0.07, 0.04, -0.03, 0.05, -0.04, 0.02, -0.05, 0.06, -0.03, 0.04], 0.25),
  },
  {
    id: 'medium',
    label: 'Medium risk',
    level: 'MEDIUM',
    data: withV(120511, [-3.26, -3.6, 2.19, 2.59, 2.36, -1.99, 1.51, -1.18, -1.62, -2.14, -1.82, -1.94, 1.64, -3.06, 2.63, -1.51, 1.94, 2.31, 2.76, -1.17, 1.73, 1.55, 2.22, -1.32, 1.45, -1.16, -1.55, 1.06], 4.33),
  },
  {
    id: 'high',
    label: 'High risk',
    level: 'HIGH',
    data: withV(123281, [-3.38, -3.73, 2.27, 2.69, 2.44, -2.07, 1.57, -1.22, -1.68, -2.22, -1.89, -2.01, 1.71, -3.17, 2.73, -1.57, 2.01, 2.4, 2.87, -1.21, 1.8, 1.61, 2.3, -1.37, 1.5, -1.21, -1.6, 1.1], 4.48),
  },
  {
    id: 'critical',
    label: 'Critical risk',
    level: 'CRITICAL',
    data: withV(165432, [-5.23, -5.67, 3.45, 4.12, 3.78, -3.23, 2.45, -1.89, -2.56, -3.45, -2.89, -3.12, 2.67, -4.89, 4.23, -2.45, 3.12, 3.67, 4.45, -1.89, 2.78, 2.45, 3.56, -2.12, 2.34, -1.89, -2.45, 1.67], 6.75),
  },
]

type Validation = { ok: true; data: TransactionInput } | { ok: false; error: string }

const listFields = (fields: string[]) =>
  fields.length > 4 ? `${fields.slice(0, 4).join(', ')} and ${fields.length - 4} more` : fields.join(', ')

/** Checks for every model input as a finite number and drops unknown keys. */
export function validateTransaction(value: unknown): Validation {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { ok: false, error: 'Expected a JSON object with Time, V1–V28 and Scaled_Amount.' }
  }
  const record = value as Record<string, unknown>
  const missing = FEATURE_KEYS.filter((key) => !(key in record))
  if (missing.length) return { ok: false, error: `Missing fields: ${listFields(missing)}.` }
  const invalid = FEATURE_KEYS.filter((key) => typeof record[key] !== 'number' || !Number.isFinite(record[key]))
  if (invalid.length) return { ok: false, error: `These fields must be numbers: ${listFields(invalid)}.` }
  return { ok: true, data: Object.fromEntries(FEATURE_KEYS.map((key) => [key, record[key]])) as TransactionInput }
}
