import Link from "next/link";

export function Footer() {
  return <footer className='bg-slate-50'>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className='py-16'>
        <h3 className='font-bold mx-auto text-center'>tutorify.</h3>
        <nav className="mt-10 text-sm">
          <div className='flex justify-center gap-8'>
            <Link href="/#features" shallow>Subjects</Link> 
            <Link href="/#features" shallow>Services</Link> 
            <Link href="/#features" shallow>About Us</Link> 
          </div>
        </nav>
      </div>
      <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
        <div className="flex gap-8">
        </div>
        <p className="text-sm text-slate-600">
          Created by <a href="https://jackdunn.info" className="underline font-semibold text-green-600">Jack Dunn.</a>
        </p>
      </div>
    </div>
  </footer>
}
