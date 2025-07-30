import { SignIn } from "@clerk/nextjs";


export default function Page() {
  return <div className="my-6 flex items-center justify-center">
    <SignIn />
  </div>
}
