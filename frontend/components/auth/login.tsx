"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type LoginType = {
  email: string;
  password: string;
};
export const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginType>();
  const { toast } = useToast();
  const router = useRouter();
  const onSubmit = async (data: LoginType) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
      {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      console.error(response.statusText);
      toast({
        title: "Server Side Error",
      });
      return;
    }
    const { token } = await response.json();
    localStorage.setItem("token", token);
    toast({
      title: "Registration Completed!",
      description: "Redirecting to dashboard in 5 secs",
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email")}
          type="email"
          placeholder="Your Email"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          {...register("password")}
          type="password"
          placeholder="Your Password"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};
