import { useState } from 'react'
import type { BalanceResponse } from '../types/api'

interface BalanceDisplayProps {
  address: string;
}

export default function BalanceDisplay({ address }: BalanceDisplayProps) {
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  async function checkBalance() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/balance/${address}`)
      if (!response.ok) throw new Error('Failed to fetch balance')
      const data: BalanceResponse = await response.json()
      // Round to integer for cleaner mobile display
      const roundedBalance = Math.floor(parseFloat(data.balance)).toString()
      setBalance(roundedBalance)
      setLastChecked(new Date().toLocaleTimeString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const isRich = balance ? parseFloat(balance) >= 1000000 : false

  return (
    <div className="balance-card">
      <h2>Is Ephraim rich?</h2>

      {balance ? (
        <>
          <div className="balance-amount">
            {balance} <span className="currency">XRP</span>
          </div>
          <div className="rich-status">
            {isRich ? '🤑 Yes!' : '😅 Not yet!'}
          </div>
          {lastChecked && (
            <p className="last-checked">Last checked: {lastChecked}</p>
          )}
        </>
      ) : null}

      {error && <div className="error-message">Error: {error}</div>}

      <button
        onClick={checkBalance}
        disabled={loading}
        className="check-balance-btn"
      >
        {loading ? 'Checking...' : 'Check Balance'}
      </button>
    </div>
  )
}
