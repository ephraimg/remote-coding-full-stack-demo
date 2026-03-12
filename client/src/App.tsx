import BalanceDisplay from './components/BalanceDisplay'
import PaymentQR from './components/PaymentQR'
import './App.css'

// Ephraim's XRP address from environment variable
// Vite exposes env vars prefixed with VITE_
const EPHRAIM_ADDRESS = import.meta.env.VITE_EXAMPLE_XRP_ADDRESS as string

// Fail fast if environment variable is not set
if (!EPHRAIM_ADDRESS) {
  throw new Error(
    'Missing required environment variable: VITE_EXAMPLE_XRP_ADDRESS\n' +
    'Create a .env file in the client directory with:\n' +
    'VITE_EXAMPLE_XRP_ADDRESS=your-xrp-address'
  )
}

function App() {
  return (
    <div className="app">
      <header>
        <h1>Remote coding demo</h1>
      </header>

      <main>
        <BalanceDisplay address={EPHRAIM_ADDRESS} />
        <PaymentQR address={EPHRAIM_ADDRESS} amount="10" />
      </main>

      <footer>
        <p><code>{EPHRAIM_ADDRESS}</code></p>
      </footer>
    </div>
  )
}

export default App
