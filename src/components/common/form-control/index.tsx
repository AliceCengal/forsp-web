import {
  HTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
} from "react";

type FormControlBase<T> = {
  label?: string | ReactNode;
  hint?: string | ReactNode;
  layout?: T;
};
type TextFieldLayout = "vertical" | "horizontal" | "freeform";
type TextFieldProps = InputHTMLAttributes<HTMLInputElement> &
  FormControlBase<TextFieldLayout>;

export function TextField({ label, hint, layout, ...props }: TextFieldProps) {
  const labelNode = typeof label === "string" ? <span>{label}</span> : label;

  const hintNode =
    typeof hint === "string" ? (
      <span style={{ fontSize: "0.9em", color: "var(--c-con-7)" }}>{hint}</span>
    ) : (
      hint
    );

  return (
    <label
      style={
        layout == "freeform"
          ? { display: "contents" }
          : layout == "horizontal"
          ? {
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              columnGap: "var(--sp-1)",
              alignItems: "baseline",
            }
          : { display: "grid" }
      }
    >
      {labelNode}
      {hintNode}
      <input {...props} />
    </label>
  );
}

type TextAreaProps = HTMLAttributes<HTMLTextAreaElement> &
  FormControlBase<TextFieldLayout>;

export function TextArea({ label, hint, layout, ...props }: TextAreaProps) {
  const labelNode = typeof label === "string" ? <span>{label}</span> : label;

  const hintNode =
    typeof hint === "string" ? (
      <span style={{ fontSize: "0.9em", color: "gray" }}>{hint}</span>
    ) : (
      hint
    );

  return (
    <label style={{ display: "grid" }}>
      {labelNode}
      {hintNode}
      <textarea {...props} />
    </label>
  );
}

type CheckboxLayout = "horizontal" | "horizontal-reverse";
type CheckboxProps = HTMLAttributes<HTMLInputElement> &
  FormControlBase<CheckboxLayout>;
export function Checkbox({ label, hint, layout, ...props }: CheckboxProps) {
  return (
    <label
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "var(--sp-1)",
      }}
    >
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}

type RadioGroupProps = HTMLAttributes<HTMLFieldSetElement> & {
  name: string;
  label: ReactNode;
  children: ReactNode;
};

export function RadioGroup({
  name,
  label,
  children,
  defaultValue,
  ...props
}: RadioGroupProps) {
  return (
    <fieldset
      style={{
        display: "grid",
        gap: "var(--sp-1)",
      }}
      {...props}
    >
      <RadioCtx.Provider value={{ name, defaultValue }}>
        <div>{label}</div>
        {children}
      </RadioCtx.Provider>
    </fieldset>
  );
}

type RadioProps = PropsWithChildren<{
  value: any;
}>;

export function Radio({ value, children }: RadioProps) {
  const ctx = useContext(RadioCtx);
  if (!ctx) {
    throw new Error("Radio must be used inside a RadioGroup");
  }
  const name = ctx.name;
  const defaultValue = ctx.defaultValue;
  return (
    <label
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "var(--sp-1)",
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={value === defaultValue}
      />
      <span>{children}</span>
    </label>
  );
}

const RadioCtx = createContext<{
  name: RadioGroupProps["name"];
  defaultValue?: any;
} | null>(null);

type SelectProps = HTMLAttributes<HTMLSelectElement> & { label: string };

export function Select({ label, children, ...props }: SelectProps) {
  return (
    <label
      style={{
        display: "grid",
      }}
    >
      <span>{label}</span>
      <select {...props}>{children}</select>
    </label>
  );
}

type FormdataOptions = {
  withCheckboxGroups?: string[];
};

export function formdata(target: HTMLFormElement, opts?: FormdataOptions) {
  const data = Object.fromEntries(new FormData(target));

  if (opts?.withCheckboxGroups?.length) {
  }

  return data;
}
