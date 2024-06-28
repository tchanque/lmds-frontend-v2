import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../UsersAdminDashboard/VerticalDotsIcon";
import { SearchIcon } from "../UsersAdminDashboard/SearchIcon";
import { ChevronDownIcon } from "../UsersAdminDashboard/ChevronDownIcon";
import { columns } from "./data";
import { capitalize } from "./utils";
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { axiosPrivate } from "../../../api/axios";
import { useAtom } from "jotai";
import { bearerTokenAtom } from "../../../atom/atoms";
import { useNavigate } from "react-router-dom";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "title",
  "category",
  "price",
  "location",
  "start_date",
  "end_date",
  "actions",
];

const EventsAdminDashboard = () => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [token, setToken] = useAtom(bearerTokenAtom);

  const hasSearchFilter = Boolean(filterValue);

  const navigate = useNavigate();

  const handleDropdownItemClick = (action, eventId) => {
    switch (action) {
      case "view":
        navigate(`/events/${eventId}`);
        break;
      case "delete":
        deleteEventData(eventId);
        break;
      default:
        break;
    }
  };

  const deleteEventData = async (eventId) => {
    const confirmDeletion = window.confirm("Êtes-vous sûr de vouloir supprimer cet évènement?");
    if (!confirmDeletion) return;

    try {
      const response = await axiosPrivate.delete(`/events/${eventId}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'évènement", error);
    }
  };

  useEffect(() => {
    axiosPrivate
      .get("/events", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredEvents = [...events];

    if (hasSearchFilter) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          event.category.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredEvents;
  }, [events, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((event, columnKey) => {
    const cellValue = event[columnKey];

    switch (columnKey) {
      case "title":
        return event.title;
      case "category":
        return event.category;
      case "price":
        return event.price;
      case "location":
        return event.location;
      case "start_date":
        return event.start_date;
      case "end_date":
        return event.end_date;
      case "actions":
        return (
          <div className="relative flex justify-start items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => handleDropdownItemClick("delete", event.id)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, [handleDropdownItemClick]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mt-5">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by titre, catégorie..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 mr-5">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Colonnes
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total : {events.length} évènements
          </span>
          <label className="flex items-center text-default-400 text-small mr-5">
            Lignes par page :
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onRowsPerPageChange, events.length, onSearchChange, onClear]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center mr-5">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} sur ${filteredItems.length} selectionnés`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Précedent
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Suivant
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No evenements found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EventsAdminDashboard;
