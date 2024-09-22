"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type RegisterType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = () => {
  const { register, handleSubmit } = useForm<RegisterType>();
  const { toast } = useToast();
  const router = useRouter();
  const onSubmit = async (data: RegisterType) => {
    if (data.password.localeCompare(data.confirmPassword) !== 0) {
      toast({
        title: "Password re-entry mismatch",
        description: "Password and Confirm Password doesn't match.",
      });
      return;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
      {
        body: JSON.stringify(data),
        method: "POST",
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
        <Label htmlFor="name">Name</Label>
        <Input
          {...register("name")}
          type="text"
          placeholder="Your Name"
          required
        />
      </div>
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
          placeholder="Password"
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
};
