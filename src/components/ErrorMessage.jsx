export function ErrorMessage ({ message }) {
  return (
    <div className='px-3 py-2 text-sm text-gray-600 border border-red-500 rounded-md dark:text-gray-100 bg-red-500/10'>An error occurred. Either the engine you requested does not exist or there was another issue processing your request. Please, try again later.</div>
  )
}
