export default function RouteDisabled({ route }: { route: string }) {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-400 mb-4">
          Route Temporarily Disabled
        </h1>
        <p className="text-zinc-500">
          The route <code className="bg-zinc-800 px-2 py-1 rounded">{route}</code> is currently disabled for maintenance.
        </p>
      </div>
    </div>
  )
}