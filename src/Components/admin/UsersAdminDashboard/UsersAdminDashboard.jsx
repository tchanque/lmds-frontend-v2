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
  User,
  Pagination,
} from "@nextui-org/react";
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { columns } from "./data";
import { capitalize } from "./utils";
import { useState } from "react";
import axios from "axios";
import { axiosPrivate } from "../../../api/axios";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { bearerTokenAtom, popUpAdminFormAtom } from "../../../atom/atoms";
import { useNavigate } from "react-router-dom";
import "./usersAdminDashboard.css";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "first_name",
  "last_name",
  "role",
  "is_subscriber",
  "email",
  "actions",
];

const UsersAdminDashboard = () => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "first_name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = useState([]);
  const [token] = useAtom(bearerTokenAtom);
  const [popUpAdminForm, setPopUpAdminForm] = useAtom(popUpAdminFormAtom);
  
  const navigate = useNavigate();

  const handleDropdownItemClick = (action, userId) => {
    switch (action) {
      case "view":
        navigate(`/users/${userId}`);
        break;
      case "delete":
        deleteUserData(userId);
        break;
      default:
        break;
    }
  };

  const deleteUserData = async (userId) => {
    const confirmDeletion = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?");
    if (!confirmDeletion) return;
  
    try {
      const response = await axiosPrivate.delete(`/users/${userId}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
    }
  };

  useEffect(() => {
    axiosPrivate
      .get("/users", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (filterValue) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    
    return filteredUsers;
  }, [users, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const openPopup = () => {
    setPopUpAdminForm(true);
  };

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.team}
            </p>
          </div>
        );
        case "is_subscriber":
          return cellValue ? "Oui" : "Non";
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
                <DropdownItem onClick={() => handleDropdownItemClick("view", user.id)}>View</DropdownItem>
                <DropdownItem onClick={() => handleDropdownItemClick("delete", user.id)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mt-5">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Rechercher par prénom, nom, email..."
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
            <Button
              color="primary"
              onClick={openPopup}
              endContent={<PlusIcon />}
            >
              Créer
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total : {users.length} membres
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
  }, [
    filterValue,
    visibleColumns,
    users.length,
    onSearchChange,
    onClear,
    onRowsPerPageChange,
    openPopup,
  ]);

  return (
    <div className="w-full flex flex-col">
      {topContent}
      <Table
        aria-label="Users table"
        classNames={{
          base: "mt-5",
          table: "min-h-[400px]",
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        containerClassName="overflow-scroll"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.uid === "name" || column.uid === "role"}
              maxWidth={column.uid === "actions" ? 50 : undefined}
              className="text-center align-middle"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.id} className="text-center align-middle">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        isCompact
        showControls
        showShadow
        className="mt-4 self-end"
        page={page}
        total={pages}
        onChange={setPage}
        onNext={onNextPage}
        onPrevious={onPreviousPage}
      />
    </div>
  );
};

export default UsersAdminDashboard;
