import Container from "@/Components/Container";
import ThirdButton from "@/Components/ThirdButton";
import App from "@/Layouts/App";
import { Head, Link, router } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { usePermission } from "@/Composables/Permission";
import {
    IconChevronDown,
    IconChevronUp,
    IconEdit,
    IconStethoscope,
    IconUserEdit,
} from "@tabler/icons-react";
import Badge from "@/Components/Badge";
import Table from "@/Components/Table";
import { IconPhoneCall } from "@tabler/icons-react";
import { IconRefresh } from "@tabler/icons-react";
import ThirdButtonLink from "@/Components/ThirdButtonLink";
import Pagination from "@/Components/Pagination";
import { IconPlus } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import Modal from "@/Components/Modal";
import Create from "./Create";
const { hasRole } = usePermission();
const { hasPermission } = usePermission();

export default function Index(props) {
    const { data: users, meta, filtered, attributes } = props.users;
    const roles = props.roles;
    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [state, setState] = useState([]);
    const [isInitialRender, setIsInitialRender] = useState(true);

    var curr = new Date();
    curr.setDate(curr.getDate());
    var date = curr.toISOString().substring(0, 10);

    const reload = useCallback(
        debounce((query) => {
            router.get(
                route(route().current(), [SectionID]),
                { ...pickBy(query), page: query.page },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }, 150),
        []
    );
    useEffect(() => {
        if (!isInitialRender) {
            reload(params);
        } else {
            setIsInitialRender(false);
        }
    }, [params]);
    useEffect(() => {
        let numbers = [];
        for (
            let i = attributes.per_page;
            i < attributes.total / attributes.per_page;
            i = i + attributes.per_page
        ) {
            numbers.push(i);
        }
        setPageNumber(numbers);
    }, []);
    const onChange = (event) => {
        const updatedParams = {
            ...params,
            [event.target.name]: event.target.value,
            page: 1, // Set page number to 1
        };
        setParams(updatedParams);
    };
    const sort = (item) => {
        setParams({
            ...params,
            field: item,
            direction: params.direction == "asc" ? "desc" : "asc",
        });
    };

    // CRUD
    const [selectedRow, setSelectedRow] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const selectRow = (index) => {
        if (selectedRow === index) {
            setSelectedRow(null);
        } else {
            setSelectedRow(index);
        }
    };

    const [showModalCreate, setShowModalCreate] = useState(false);
    const openCreateModal = () => {
        setShowModalCreate(true);
    };
    const closeCreateModal = () => {
        setShowModalCreate(false);
    };

    // END CRUD
    return (
        <>
            <Head title="Users" />
            <Modal show={showModalCreate}>
                <Create roles={roles}/>
                <ThirdButton onClick={closeCreateModal}>Close</ThirdButton>
            </Modal>
            <Container>
                <div className="flex justify-between p-1 space-x-3 overflow-x-auto bg-white rounded whitespace-nowrap">
                    <button
                        className={`md:w-full rounded p-2.5 text-sm font-medium leading-5 transition-all duration-300 ${
                            params.jenis == "semuadata"
                                ? "bg-blue-300 ring-blue-300"
                                : "bg-gray-300 ring-gray-300"
                        } text-white ring-2  ring-opacity-60 ring-offset-2 ring-offset-white focus:outline-none focus:ring-2`}
                        type="button"
                        name="jenis"
                        value={"semuadata"}
                        onClick={onChange}
                    >
                        Semua Data
                    </button>
                    <button
                        className={`md:w-full rounded p-2.5 text-sm font-medium leading-5 transition-all duration-300 ${
                            params.jenis == "belumperiksa"
                                ? "bg-blue-300 ring-blue-300"
                                : "bg-gray-300 ring-gray-300"
                        } text-white ring-2  ring-opacity-60 ring-offset-2 ring-offset-white focus:outline-none focus:ring-2`}
                        type="button"
                        name="jenis"
                        value={"belumperiksa"}
                        onClick={onChange}
                    >
                        Belum Periksa
                    </button>
                    <button
                        className={`md:w-full rounded p-2.5 text-sm font-medium leading-5 transition-all duration-300 ${
                            params.jenis == "sudahperiksa"
                                ? "bg-blue-300 ring-blue-300"
                                : "bg-gray-300 ring-gray-300"
                        } text-white ring-2  ring-opacity-60 ring-offset-2 ring-offset-white focus:outline-none focus:ring-2`}
                        type="button"
                        name="jenis"
                        value={"sudahperiksa"}
                        onClick={onChange}
                    >
                        Sudah Periksa
                    </button>
                </div>

                <div className="items-center justify-between mb-2 overflow-x-auto md:flex">
                    <div className="w-full overflow-x-auto md:w-1/2">
                        <div className="flex items-center justify-start mt-2 mb-0 gap-x-1">
                            <ThirdButton
                                type="button"
                                onClick={() => {
                                    openCreateModal();
                                }}
                            >
                                Tambah
                                <IconPlus className="w-4 h-4" />
                            </ThirdButton>
                            <ThirdButton
                                color={selectedRow === null ? "gray" : "red"}
                                type="button"
                                className={`${
                                    selectedRow === null
                                        ? "cursor-not-allowed"
                                        : ""
                                }`}
                                onClick={() => {
                                    if (selectedRow !== null) {
                                        const selected = users[selectedRow];
                                        // openDestroyDialog(selected);
                                    }
                                }}
                                disabled={selectedRow === null}
                            >
                                Edit
                                <IconEdit className="w-4 h-4" />
                            </ThirdButton>
                            <ThirdButton
                                color={selectedRow === null ? "gray" : "cyan"}
                                type="button"
                                className={`${
                                    selectedRow === null
                                        ? "cursor-not-allowed"
                                        : ""
                                }`}
                                onClick={() => {
                                    if (selectedRow !== null) {
                                        const selected = users[selectedRow];
                                        // openEditDialog(selected);
                                    }
                                }}
                                disabled={selectedRow === null}
                            >
                                Hapus
                                <IconTrash className="w-4 h-4" />
                            </ThirdButton>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto md:w-1/2">
                        <div className="flex items-center justify-end mt-4 mb-0 gap-x-1">
                            <InputLabel htmlFor="Periode" value="Periode" />
                            <TextInput
                                type="date"
                                id="startdate"
                                name="startdate"
                                defaultValue={date}
                                className="block w-1/4 text-sm"
                                autoComplete="startdate"
                                onChange={onChange}
                                required
                            />
                            <InputLabel htmlFor="Sampai" value="Sampai" />
                            <TextInput
                                type="date"
                                id="enddate"
                                name="enddate"
                                defaultValue={date}
                                className="block w-1/4 text-sm"
                                autoComplete="enddate"
                                onChange={onChange}
                                required
                            />
                            <select
                                name="load"
                                id="load"
                                onChange={onChange}
                                value={params.load}
                                className="text-sm transition duration-150 ease-in-out border-gray-300 rounded focus:ring-blue-200 focus:ring form-select"
                            >
                                {pageNumber.map((page, index) => (
                                    <option key={index}>{page}</option>
                                ))}
                            </select>
                            <div className="flex items-center px-2 text-sm transition duration-150 ease-in-out bg-white border border-gray-300 rounded gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring">
                                <svg
                                    className="inline w-4 h-4 text-sm text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name="q"
                                    id="q"
                                    onChange={onChange}
                                    value={params.q}
                                    className="w-full text-sm border-0 focus:ring-0 form-text"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nomor</Table.Th>
                            <Table.Th onClick={() => sort("name")}>
                                Nama
                                {params.field == "name" &&
                                    params.direction == "asc" && (
                                        <IconChevronUp className="w-4 h-4" />
                                    )}
                                {params.field == "name" &&
                                    params.direction == "desc" && (
                                        <IconChevronDown className="w-4 h-4" />
                                    )}
                            </Table.Th>
                            <Table.Th onClick={() => sort("email")}>
                                Email
                                {params.field == "email" &&
                                    params.direction == "asc" && (
                                        <IconChevronUp className="w-4 h-4" />
                                    )}
                                {params.field == "email" &&
                                    params.direction == "desc" && (
                                        <IconChevronDown className="w-4 h-4" />
                                    )}
                            </Table.Th>
                            <Table.Th>Roles</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {users.map((user, index) => (
                            <tr
                                key={index}
                                className={
                                    selectedRow === index
                                        ? "bg-sky-100  cursor-pointer"
                                        : "cursor-pointer"
                                }
                                onClick={() => selectRow(index)}
                            >
                                <Table.Td>
                                    <Badge>{index + 1}</Badge>
                                </Table.Td>
                                <Table.Td>{user.name}</Table.Td>
                                <Table.Td>{user.email}</Table.Td>
                                <Table.Td>
                                    {user.roles.map((role, index) => (
                                        <Badge key={index}>{role.name} </Badge>
                                    ))}
                                </Table.Td>
                            </tr>
                        ))}
                    </Table.Tbody>
                </Table>
                <Pagination meta={meta} />
            </Container>
        </>
    );
}
Index.layout = (page) => <App children={page} />;
