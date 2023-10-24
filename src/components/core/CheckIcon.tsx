function CheckIcon(props) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5 flex-none fill-emerald-500 stroke-white dark:fill-emerald-200/20 dark:stroke-emerald-200"
      {...props}>
      <circle cx="10" cy="10" r="10" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6.75 10.813 2.438 2.437c1.218-4.469 4.062-6.5 4.062-6.5"
      />
    </svg>
  );
}
