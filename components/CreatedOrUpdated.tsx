"use client";

import { format } from "date-fns";


interface CreatedProps {
  name: string,
  createdAt: Date,
  updatedAt: Date,
}

const CreatedOrUpdated = ({
  name,
  createdAt,
  updatedAt
}: CreatedProps) => {

  const wasUpdated = format(updatedAt, "HH:mm MMMM do, yyyy") > format(createdAt, "HH:mm MMMM do, yyyy");

  return (
    <div className="flex items-center justify-between bg-muted py-2 px-4 rounded-lg">
      <h1 className="flex flex-row">{wasUpdated ? "Updated by" : "Created by"}: <p className="font-bold ml-4">{name}</p></h1>
      <i>{wasUpdated ? format(updatedAt, "HH:mm MMMM do, yyyy") : format(createdAt, "HH:mm MMMM do, yyyy")}</i>
    </div>
  )
}

export default CreatedOrUpdated;
