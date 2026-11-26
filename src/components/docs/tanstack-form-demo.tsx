import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { KiraField, createZodValidator } from "@/components/ui/field";

const emailValidators = createZodValidator(
  z.email("Enter a valid email address."),
  { onBlur: false },
);

export function TanStackFormDemo() {
  const [submitted, setSubmitted] = useState("");

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: ({ value }) => {
      setSubmitted(`Email ready to submit: ${value.email}`);
    },
  });

  return (
    <form
      className="w-full max-w-sm space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted("");
        void form.handleSubmit();
      }}
      onReset={(event) => {
        event.preventDefault();
        form.reset();
        setSubmitted("");
      }}
    >
      <form.Field name="email" validators={emailValidators}>
        {(field) => (
          <KiraField
            field={field}
            label="Email address"
            required
            inputProps={{ type: "email", autoComplete: "email" }}
          />
        )}
      </form.Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Review email</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      <output className="block text-sm text-muted-foreground">
        {submitted}
      </output>
    </form>
  );
}
