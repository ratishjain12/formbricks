"use client";

import IsPasswordValid from "@/app/components/auth/IsPasswordValid";
import { resetPassword } from "@/app/lib/users/users";
import { PasswordInput } from "@formbricks/ui/PasswordInput";
import { Button } from "@formbricks/ui/Button";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = searchParams?.get("token");
    try {
      if (!token) throw new Error("No token provided");
      await resetPassword(token, e.target.elements.password.value);

      router.push("/auth/forgot-password/reset/success");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="absolute top-10 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">An error occurred when logging you in</h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="space-y-1 whitespace-pre-wrap">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-800">
            New password
          </label>
          <div className="mt-1">
            <PasswordInput
              id="password"
              name="password"
              value={password ? password : ""}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="*******"
              required
              className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
            />
            <IsPasswordValid password={password} setIsValid={setIsValid} />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            variant="darkCTA"
            disabled={!isValid}
            className="w-full justify-center"
            loading={loading}>
            Reset password
          </Button>
        </div>
      </form>
    </>
  );
};
