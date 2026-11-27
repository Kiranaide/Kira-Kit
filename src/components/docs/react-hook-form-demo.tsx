import { useState } from "react";
import { Controller, useForm, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const teams = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
];

interface RequestValues {
  name: string;
  team: string | null;
  notes: string;
}

function TeamField({ control }: { control: Control<RequestValues> }) {
  return (
    <Controller
      name="team"
      control={control}
      rules={{ required: "Choose a team." }}
      render={({ field, fieldState }) => (
        <Field invalid={fieldState.invalid} required>
          <FieldLabel>Team</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            items={teams}
            required
          >
            <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
              <SelectValue placeholder="Choose a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  );
}

export function ReactHookFormDemo() {
  const [submitted, setSubmitted] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestValues>({
    defaultValues: { name: "", team: null, notes: "" },
  });

  return (
    <form
      className="w-full max-w-sm space-y-4"
      noValidate
      onSubmit={(event) => {
        setSubmitted("");
        void handleSubmit(({ name, team }) => {
          const label = teams.find((item) => item.value === team)?.label;

          setSubmitted(`Request ready for ${name.trim()} · ${label ?? ""}`);
        })(event);
      }}
      onReset={() => {
        reset();
        setSubmitted("");
      }}
    >
      <Field invalid={Boolean(errors.name)} required>
        <FieldLabel>Full name</FieldLabel>
        <FieldControl
          render={<Input autoComplete="name" />}
          {...register("name", {
            validate: (value) => value.trim() !== "" || "Enter your full name.",
          })}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>
      <TeamField control={control} />
      <Field>
        <FieldLabel>Notes (optional)</FieldLabel>
        <FieldControl render={<Textarea rows={3} />} {...register("notes")} />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Review request</Button>
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
