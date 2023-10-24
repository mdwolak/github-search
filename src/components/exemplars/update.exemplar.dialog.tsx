import { useState } from "react";

import { TrashIcon } from "@heroicons/react/24/outline";

import { ApiErrorMessage, Button, IconButton, toast } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOverHeader } from "~/components/dialogs/SlideOver";
import styles from "~/components/dialogs/SlideOver.module.css";
import {
  Form,
  Input,
  ValidationSummary,
  getDefaultOnErrorOption,
  useForm,
} from "~/components/forms";
import { type HandleCloseProps, stripNullishProps } from "~/lib/common";
import { type UpdateExemplarInput, updateExemplarSchema } from "~/lib/schemas/exemplar.schema";
import { type ExemplarInfo } from "~/server/api/routers/exemplar.router";
import { type RouterOutputs, api } from "~/utils/api";

type UpdateExemplarDialogProps = HandleCloseProps<
  RouterOutputs["exemplar"]["update"]["exemplar"]
> & {
  exemplar: ExemplarInfo;
};

const UpdateExemplarDialog = ({ exemplar, handleClose }: UpdateExemplarDialogProps) => {
  const apiContext = api.useContext();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: deleteExemplar } = api.exemplar.delete.useMutation({
    onSuccess() {
      apiContext.exemplar.invalidate();
      toast.success("Exemplar deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: updateExemplarSchema.shape.data,
    defaultValues: stripNullishProps(exemplar),
  });

  const {
    mutate: updateExemplar,
    isLoading,
    error: apiError,
  } = api.exemplar.update.useMutation({
    onSuccess(data) {
      handleClose(data.exemplar);
      apiContext.exemplar.invalidate();
      toast.success("Exemplar updated successfully");
    },
    onError: getDefaultOnErrorOption(form),
  });

  const handleSubmit = (data: UpdateExemplarInput["data"]) => {
    updateExemplar({ id: exemplar.id, data });
  };

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          <SlideOverHeader title="Update Exemplar" handleClose={handleClose}>
            <IconButton Icon={TrashIcon} onClick={() => setOpenDelete(true)} srText="Delete" />
          </SlideOverHeader>
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
      <ConfirmDelete
        open={openDelete}
        handleClose={(confirm) => {
          if (confirm) {
            deleteExemplar(exemplar.id);
            handleClose();
          }
          setOpenDelete(false);
        }}
        title="Delete exemplar"
        description="Are you sure you want to delete this exemplar? This action cannot be undone."
      />
    </>
  );
};

export default UpdateExemplarDialog;
