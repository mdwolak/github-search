import { useState } from "react";

import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { FormattedDate, Link } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import CreateExemplarDialog from "~/components/exemplars/create.exemplar.dialog";
import UpdateExemplarDialog from "~/components/exemplars/update.exemplar.dialog";
import { getLayout } from "~/components/layouts/Layout";
import { type ExemplarInfo } from "~/server/api/routers/exemplar.router";
import { api } from "~/utils/api";

const ExemplarList = () => {
  const apiContext = api.useContext();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateExemplar, setUpdateExemplar] = useState<ExemplarInfo | null>(null);
  const [deleteExemplarId, setDeleteExemplarId] = useState<number>(0);

  const { data: exemplars } = api.exemplar.getFiltered.useQuery(
    { limit: 10, page: 1 },
    {
      select: (data) => data?.exemplars,
      onError(error) {
        toast.error(error.message);
      },
    }
  );

  const { mutate: deleteExemplar } = api.exemplar.delete.useMutation({
    onSuccess() {
      apiContext.exemplar.invalidate();
      toast.success("Exemplar deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div className="sm:px-2 lg:px-4">
      <TableCaption
        title="Exemplars"
        buttonText="Add Exemplar"
        onButtonClick={() => setOpenCreate(true)}>
        Manage exemplars for your account.
      </TableCaption>
      <div>
        {exemplars?.length === 0 ? (
          <Message>There are no exemplars at the moment</Message>
        ) : (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <THeader first>Exemplar</THeader>
                  <THeader screen="sm">Category</THeader>
                  <THeader screen="lg">Content</THeader>
                  <THeader screen="lg">Created</THeader>
                  {/* <THeader>Price</THeader> */}
                  <THeader last>
                    <span className="sr-only">Select</span>
                  </THeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exemplars?.map((exemplar) => (
                  <tr key={exemplar.id}>
                    <TCell first>
                      {exemplar.name}
                      {exemplar.published && (
                        <span className="ml-1 text-indigo-600">(published)</span>
                      )}
                    </TCell>
                    <TCell screen="sm">{exemplar.category}</TCell>
                    <TCell screen="lg">{exemplar.content}</TCell>
                    <TCell screen="lg">
                      <FormattedDate date={exemplar.createdAt} />
                    </TCell>
                    {/* <TCell>
                  <div className="sm:hidden">{exemplar.price}/mo</div>
                  <div className="hidden sm:block">{exemplar.price}/month</div>
                </TCell> */}
                    <TCell last className="space-x-2">
                      <Link href="#" onClick={() => setUpdateExemplar(exemplar)}>
                        Edit<span className="sr-only">, {exemplar.name}</span>
                      </Link>
                      <span>|</span>

                      <Link
                        href="#"
                        variant="secondary"
                        onClick={() => setDeleteExemplarId(exemplar.id)}>
                        Delete<span className="sr-only">, {exemplar.name}</span>
                      </Link>
                    </TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlideOver open={!!updateExemplar} onClose={() => setUpdateExemplar(null)}>
        <UpdateExemplarDialog
          exemplar={updateExemplar as ExemplarInfo}
          handleClose={() => setUpdateExemplar(null)}
        />
      </SlideOver>

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateExemplarDialog handleClose={() => setOpenCreate(false)} />
      </SlideOver>

      <ConfirmDelete
        title="Delete exemplar"
        description="Are you sure you want to delete this exemplar? This action cannot be undone."
        open={!!deleteExemplarId}
        handleClose={(confirm) => {
          if (confirm) deleteExemplar(deleteExemplarId);
          setDeleteExemplarId(0);
        }}
      />
    </div>
  );
};
ExemplarList.getLayout = getLayout;
export default ExemplarList;
