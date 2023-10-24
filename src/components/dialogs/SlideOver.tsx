import { Fragment, type ReactNode } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { type HandleCloseProps } from "~/lib/common";

export type SlideOverProps = {
  open: boolean;
  onClose: () => void; //(false) => void. Called when the user clicks outside the dialog or presses the Escape key.
  children: ReactNode;
};

export function SlideOver({ open, onClose, children }: SlideOverProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export type SlideOverHeaderProps = HandleCloseProps & {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function SlideOverHeader({ title, subtitle, handleClose, children }: SlideOverHeaderProps) {
  return (
    <div className="bg-gray-50 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500"
          onClick={() => handleClose()}>
          <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">Close panel</span>
        </button>
        <div className="flex-grow text-center">
          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500">{subtitle}</Dialog.Description>
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
