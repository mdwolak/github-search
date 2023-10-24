import type { InferGetServerSidePropsType } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import z, { type TypeOf } from "zod";

import AuthPanel from "~/components/auth/AuthPanel";
import { Alert, Button, Link, SEOHead } from "~/components/core";
import { Form, InputEmail, InputPassword, useForm } from "~/components/forms";
import FacebookIcon from "~/components/icons/facebook";
import { ErrorCode } from "~/lib/errorCodes";

const userLoginSchema = z.object({
  csrfToken: z.string(),
  email: z.string().min(1, "Email address is required").email("Email Address is invalid"),
  password: z.string().min(1, "Password is required"),
});
export type UserLoginInput = TypeOf<typeof userLoginSchema>;

const SignIn = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const form = useForm({ schema: userLoginSchema });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = (message: string) => message; //@
  const errorMessages: { [key: string]: string } = {
    [ErrorCode.InvalidEmailOrPassword]: "Invalid email or password",
    [ErrorCode.EmailAndPasswordAreRequired]: "E-mail and password are required",
    [ErrorCode.InternalServerError]: `${t("something_went_wrong")} ${t(
      "please_try_again_and_contact_us"
    )}`,
  };

  const callbackUrl = (router.query.callbackUrl as string) || "/";

  const handleSubmit = async (values: UserLoginInput) => {
    const res = await signIn<"credentials">("credentials", {
      ...values,
      redirect: false,
      callbackUrl,
    });

    if (res?.ok) {
      //successful login
      //form.resetField("password");
      router.push(res.url as string);
    } else if (res?.error && errorMessages[res.error])
      setErrorMessage(errorMessages[res.error] as string);
    else {
      setErrorMessage(errorMessages[ErrorCode.InternalServerError] as string);
      console.error(
        !res
          ? "SignIn returned empty response"
          : `Unknown signIn error: ${res.error}. Status: ${res.status}`
      );
    }
  };

  return (
    <>
      <SEOHead title="Sign in" description="Sign in" />
      <AuthPanel showLogo heading="Sign in">
        <div className="space-y-6">
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {/* GoogleIcon would need to be converted to a functional component */}
          <Button onClick={() => signIn("google", { callbackUrl })} fullWidth variant="secondary">
            <Image src={"/assets/google.svg"} width="20" height={20} alt={""} className="mr-2" />{" "}
            Continue with Google{" "}
          </Button>
          <Button className="!bg-[#1778f2] hover:opacity-80" Icon={FacebookIcon} fullWidth>
            Continue with Facebook
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>{" "}
          <Form form={form} handleSubmit={handleSubmit}>
            <div>
              <input
                defaultValue={csrfToken || undefined}
                type="hidden"
                hidden
                {...form.register("csrfToken")}
              />
            </div>
            <fieldset className="space-y-6" disabled={form.formState.isSubmitting}>
              <InputEmail
                label="Email"
                defaultValue="me@example.com"
                // defaultValue2={router.query.email as string}
                placeholder="me@example.com"
                {...form.register("email")}
              />
              <div className="relative">
                <div className="relative">
                  <InputPassword
                    label="Password"
                    {...form.register("password")}
                    autoComplete="current-password"
                    defaultValue="tester01"
                  />
                </div>
                <span className="absolute -top-[2px] right-0 z-auto">
                  <Link className="text-sm" href="/auth/signup">
                    Forgot password?
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                isLoading={form.formState.isSubmitting}
                disabled={!form.formState.isDirty || !form.formState.isValid}
                fullWidth>
                Sign in
              </Button>

              <div className="text-sm">
                {"Don't have an account?"} <Link href="/auth/signup">Sign up</Link>
              </div>
            </fieldset>
          </Form>
        </div>
      </AuthPanel>
    </>
  );
};
export default SignIn;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerAuthSession(context);

//   if (session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   };
// }
