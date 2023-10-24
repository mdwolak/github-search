import { useEffect } from "react";

import { ApiErrorMessage, Button, toast } from "~/components/core";
import { SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";
import {
  Form,
  Input,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import { type HandleCloseProps } from "~/lib/common";
import { type CreateExemplarInput, createExemplarSchema } from "~/lib/schemas/exemplar.schema";
import { type RouterOutputs, api } from "~/utils/api";

const CreateExemplarDialog = ({
  handleClose,
}: HandleCloseProps<RouterOutputs["exemplar"]["create"]["exemplar"]>) => {
  const apiContext = api.useContext();

  const form = useForm({
    schema: createExemplarSchema,

    defaultValues: {
      name: "name", //router.query.email
      category: "category",
      content: "content",
      published: true,
    },
  });
  const { setFocus } = form;

  const {
    mutate: createExemplar,
    isLoading,
    error: apiError,
  } = api.exemplar.create.useMutation({
    onSuccess(data) {
      handleClose(data.exemplar);
      apiContext.exemplar.invalidate();
      toast.success("Exemplar created successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const handleSubmit = (data: CreateExemplarInput) => {
    createExemplar(data);
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader
            title="Create Exemplar"
            subtitle="Get started by filling in the information below to create your new exemplar."
            handleClose={handleClose}
          />
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6" disabled={isLoading}>
            <ValidationSummary errors={form.formState.errors} />
            <ApiErrorMessage error={apiError} visible={form.formState.isValid} />

            <Input label="Name" {...form.register("name")} required />
            <Input label="Category" {...form.register("category")} required />
            <Input label="Content" {...form.register("content")} required />
          </fieldset>
          {/* /End Content */}
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={!form.formState.isDirty || !form.formState.isValid}>
            Save
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CreateExemplarDialog;
