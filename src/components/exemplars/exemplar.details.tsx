import { useState } from "react";

import toast from "react-hot-toast";

import { FormattedDate } from "~/components/core";
import { SlideOver } from "~/components/dialogs/SlideOver";
import UpdateExemplarDialog from "~/components/exemplars/update.exemplar.dialog";
import { type ExemplarInfo } from "~/server/api/routers/exemplar.router";
import { api } from "~/utils/api";

type ExemplarItemProps = {
  exemplar: ExemplarInfo;
};

const ExemplarItem = ({ exemplar }: ExemplarItemProps) => {
  const apiContext = api.useContext();
  const [selectedExemplar, setSelectedExemplar] = useState<ExemplarInfo | null>(null);

  const [openMenu, setOpenMenu] = useState(false);

  const { mutate: deleteExemplar } = api.exemplar.delete.useMutation({
    onSuccess() {
      apiContext.exemplar.invalidate();
      toast.success("Exemplar deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const onDeleteHandler = (id: number) => {
    toggleMenu();
    if (window.confirm("Are you sure")) {
      deleteExemplar(id);
    }
  };
  return (
    <>
      <div className="rounded-md bg-white shadow-md">
        <div className="p-4">
          <h5 className="mb-4 text-xl font-semibold text-[#4d4d4d]">
            {exemplar.name.length > 25 ? exemplar.name.substring(0, 25) + "..." : exemplar.name}
          </h5>
          <div className="mt-4 flex items-center">
            <p className="mr-4 rounded-sm bg-[#dad8d8] p-1">{exemplar.category}</p>
            <p className="text-[#ffa238]">
              <FormattedDate date={exemplar.createdAt} />
            </p>
          </div>
          <div className="mt-4">{exemplar.content}</div>
        </div>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="relative">
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => {
                setSelectedExemplar(exemplar);
                toggleMenu();
              }}>
              <i className="bx bx-edit-alt"></i> <span>Edit</span>
            </a>
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => onDeleteHandler(exemplar.id)}>
              <i className="bx bx-trash"></i> <span>Delete</span>
            </a>
          </div>
        </div>
      </div>
      {selectedExemplar && (
        <SlideOver open={true} onClose={() => setSelectedExemplar(null)}>
          <UpdateExemplarDialog
            exemplar={selectedExemplar}
            handleClose={() => setSelectedExemplar(null)}
          />
        </SlideOver>
      )}
    </>
  );
};

export default ExemplarItem;
