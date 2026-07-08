"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Reveal } from "@/components/site/reveal";
import { VeriqueButton, Arrow } from "@/components/site/verique-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const services = [
  "Lead Generation",
  "Meta Advertising",
  "Google Advertising",
  "Video Marketing",
  "Website Design",
  "CRM & Automation",
  "Not sure yet — recommend for me",
];

const contactSchema = z.object({
  name: z.string().min(1, "Enter your name"),
  business: z.string().min(1, "Enter your business name"),
  email: z.string().min(1, "Enter your email").email("Enter a valid email"),
  phone: z.string().min(1, "Enter your phone number"),
  service: z.string().min(1, "Select a service"),
  message: z.string().min(1, "Tell us a little about your business"),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      business: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Request received — we'll reply within one working day.");
      reset();
    } catch {
      toast.error("Something went wrong. Please email contact@verique.co.uk directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Reveal delay={1} className="rounded-[22px] border border-line bg-white p-8 shadow-[0_24px_60px_rgba(10,18,36,0.08)] sm:p-11">
      <h2 className="mb-5.5 font-display text-2xl font-bold">Request your consultation</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4.5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-name" className="text-sm font-semibold text-ink">Name</Label>
            <Input id="f-name" autoComplete="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-biz" className="text-sm font-semibold text-ink">Business name</Label>
            <Input id="f-biz" autoComplete="organization" {...register("business")} />
            {errors.business && <p className="text-xs text-destructive">{errors.business.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-email" className="text-sm font-semibold text-ink">Email</Label>
            <Input id="f-email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-phone" className="text-sm font-semibold text-ink">Phone</Label>
            <Input id="f-phone" type="tel" autoComplete="tel" {...register("phone")} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="f-service" className="text-sm font-semibold text-ink">Service interested in</Label>
            <Select value={watch("service")} onValueChange={(v) => setValue("service", v ?? "", { shouldValidate: true })}>
              <SelectTrigger id="f-service" className="w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service && <p className="text-xs text-destructive">{errors.service.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="f-msg" className="text-sm font-semibold text-ink">Message</Label>
            <Textarea
              id="f-msg"
              placeholder="What do you sell, where do you operate, and what would growth look like for you?"
              className="min-h-[130px]"
              {...register("message")}
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>
        </div>
        <div className="mt-5.5">
          <VeriqueButton type="submit" disabled={submitting} className="w-full justify-center">
            {submitting ? "Sending…" : <>Book Free Consultation <Arrow /></>}
          </VeriqueButton>
          <p className="mt-3.5 text-center text-[13px] text-slate">
            We reply within one working day. Your details are never shared.
          </p>
        </div>
      </form>
    </Reveal>
  );
}
