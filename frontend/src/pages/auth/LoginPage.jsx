"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const LoginPage = () => {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    mutateAsync: LoginUser,
    isError,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await axios.post("/api/v1/auth/login", {
          username,
          password,
        });
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
      } catch (e) {
        throw new Error(e.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  function onSubmit(values) {
    if (!values.username || !values.password) {
      toast.error("Please Fill All The Required Fields");
    }
    if (values.password.length < 6) {
      toast.error("Password Should Be At Least 6 Characters Long");
    }
    LoginUser(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <div className="text-center">
          <h1 className="font-logo text-[4rem] tracking-tight leading-tight">
            Thre<span className="text-purple-700">ads</span>
          </h1>
          <p className="tracking-tight text-gray-500 leading-4">
            To Use Threads, Please Provide All The Details Required.
          </p>
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isError && (
          <div className="text-center">
            <p className="tracking-tight text-red-600">{error.message}</p>
          </div>
        )}
        <Button
          disabled={isLoading}
          className="bg-purple-700 hover:bg-purple-800"
          type="submit"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-1" />
              Logging....
            </>
          ) : (
            "Log In"
          )}
        </Button>
        <div className="text-center">
          <p className="text-gray-500 tracking-tight">
            Don't Have An Account ?{" "}
            <Link className="ml-2 text-purple-700" to="/register">
              Register
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default LoginPage;
