"use client";

import * as React from "react";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export function AdminToaster() {
  return <Toaster position="top-right" />;
}

export function ToastFromQuery() {
  const [didRun, setDidRun] = React.useState(false);

  useEffect(() => {
    if (didRun) return;
    setDidRun(true);

    const params = new URLSearchParams(window.location.search);
    const toastType = params.get("toast");
    const message = params.get("message");

    if (!toastType) return;

    if (toastType === "success") toast.success(message ?? "Success");
    if (toastType === "error") toast.error(message ?? "Something went wrong");

    // Remove query params to avoid repeated toasts on navigation.
    params.delete("toast");
    params.delete("message");
    const newQuery = params.toString();
    const newUrl =
      window.location.pathname + (newQuery ? `?${newQuery}` : "");
    window.history.replaceState({}, "", newUrl);
  }, [didRun]);

  return null;
}

