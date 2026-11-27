import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldControl, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function NativeFormDemo() {
  const [submitted, setSubmitted] = useState("");

  return (
    <form
      className="w-full max-w-sm space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const email = new FormData(event.currentTarget).get("email");

        setSubmitted(`Email ready to submit: ${email ?? ""}`);
      }}
      onReset={() => setSubmitted("")}
    >
      <Field required>
        <FieldLabel>Email address</FieldLabel>
        <FieldControl
          name="email"
          render={<Input type="email" autoComplete="email" />}
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Review email</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      <output className="block text-sm text-muted-foreground empty:mt-0">
        {submitted}
      </output>
    </form>
  );
}
