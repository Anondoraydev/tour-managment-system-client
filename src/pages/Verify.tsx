import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dot } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state);
  const [confirmed, setConfirmed] = useState(false);
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handelConfirm = async () => {
    const toastId = toast.loading("Sending OTP...");
    try {
      const res = await sendOtp({ email }).unwrap();

      if (res.success) {
        toast.success("OTP sent successfully", { id: toastId });
        setConfirmed(true);
      }

      sendOtp({ email: email });
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const toastId = toast.loading("Verifying OTP...");
    const userInfo = {
      email: email,
      otp: data.pin,
    };

    try {
      const res = await verifyOtp(userInfo).unwrap();

      if (res.success) {
        toast.success("OTP verified successfully", { id: toastId });
        navigate("/", { state: email });
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ! need to fix this later
  // useEffect(() => {
  //   if (!email) {
  //     navigate("/");
  //   }
  // }, [email]);

  return (
    <div className="grid place-content-center h-screen ">
      {confirmed ? (
        <Card className="shadow-2xl rounded-2xl border border-gray-200 w-full max-w-md p-6">
          <CardHeader className="mb-4">
            <CardTitle className="text-2xl font-bold">
              Verify your email address
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Please enter the 6-digit code we sent to <br />
              {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="otp-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <Dot />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              form="otp-form"
              type="submit"
              className=" hover:bg-blue-700 text-white">
              Submit
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="shadow-2xl rounded-2xl border border-gray-200 w-full max-w-md p-6">
          <CardHeader className="mb-4">
            <CardTitle className="text-2xl font-bold">
              Verify your email address
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              We will send you an OTP at <br />
              {email}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-end">
            <Button
              onClick={handelConfirm}
              form="otp-form"
              type="submit"
              className=" w-[300px] text-white">
              Submit
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
