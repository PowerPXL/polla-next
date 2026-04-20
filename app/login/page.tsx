import { signInWithOAuth } from "./actions";

export default function Page() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Logga in</h1>

      <form action={() => signInWithOAuth("google")}>
        <button type="submit">
          Fortsätt med Google
        </button>
      </form>

      <form action={() => signInWithOAuth("twitter")}>
        <button type="submit">
          Fortsätt med X
        </button>
      </form>
    </>
  );
}