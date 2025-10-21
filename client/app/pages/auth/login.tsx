import { login } from "@/api/common";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { AUTH_COOKIE } from "@/config/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

const validation = z.object({
  username: z
    .string({ error: "username is required." })
    .trim()
    .min(1, "username is required."),
  password: z
    .string({
      error: "Password is required.",
    })
    .trim()
    .min(3, "Password is required.min 3 character"),
});

type T_Form = z.infer<typeof validation>;

const Login = () => {
  const [cookies] = useCookies([AUTH_COOKIE]);

  const navigate = useNavigate();

  const [isPassword, setIsPassword] = useState(false);

  const form = useForm<T_Form>({
    mode: "all",
    resolver: zodResolver(validation),
  });

  const handleSubmit = async (values: T_Form) => {
    const res = await login(values);

    if (res.s) {
      toast.success(res.m);

      navigate("/");
      return;
    }

    toast.error(res.m || "Oops! something went wrong. Please try again.");
  };

  useEffect(() => {
    if (cookies[AUTH_COOKIE]) {
      navigate("/");
    }
  }, [cookies[AUTH_COOKIE]]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl filter dark:bg-purple-900/20" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl filter dark:bg-blue-900/20" />
      </div>

      <div className="container relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[400px]">
          <div className="relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-[0_0_40px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:bg-gray-950/80 dark:shadow-[0_0_40px_rgba(0,0,0,0.2)]">
            <div className="mb-8 text-center">
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your credentials to continue
              </p>
            </div>

            <FormProvider {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <FormInput
                  name="username"
                  label="User Name"
                  placeholder="Enter user name"
                />
                <FormInput
                  name="password"
                  label="Password"
                  type={isPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  RightIcon={
                    isPassword ? (
                      <EyeOff
                        onClick={() => setIsPassword(!isPassword)}
                        className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                      />
                    ) : (
                      <Eye
                        onClick={() => setIsPassword(!isPassword)}
                        className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                      />
                    )
                  }
                />
                <Button
                  type="submit"
                  className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white transition-all hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 scale-x-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-transform hover:scale-x-100 dark:from-purple-500 dark:to-blue-500" />
                </Button>
              </form>
            </FormProvider>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-4 text-gray-500 backdrop-blur-xl dark:bg-gray-950/80 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
