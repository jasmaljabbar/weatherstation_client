import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { B_URL, BASE_URL } from "../../redux/actions/authService";
import Confirm_without_msg from "./Confirm_without_msg";

function UserList() {
  const [usersInfo, setUsersInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => {});
  const accessToken = useSelector((state) => state.auth.token);

  const handleUserAction = async (id) => {
    try {
      console.log("Handling action for user ID:", id);
      
      const response = await axios.post(
        `${BASE_URL}adminside/user_action/`,
        { id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setUsersInfo((prevUsersInfo) =>
        prevUsersInfo.map((user) =>
          user.id === id
            ? { ...user, is_active: !user.is_active }
            : user
        )
      );
      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };



  const handleModal = (id, message, action) => {
    console.log("Opening modal for user ID:", id);
    setModalMessage(message);
    setConfirmAction(() => () => action(id));
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}adminside/dashboard/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsersInfo(response.data);
        console.log("Fetched users:", response.data);
      } catch (error) {
        alert(error.message);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  if (!usersInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <Confirm_without_msg
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmAction}
        message={modalMessage}
        confirmText="Yes, I am sure"
      />
      
        <div className="flex flex-col items-center h-screen w-full mt-24 ms-40 p-6">
          <h1 className="text-purple-950 p-10 text-4xl font-bold">Users</h1>

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ml-6">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  First Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(usersInfo) &&
                usersInfo.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() =>
                      item.requested_to_tasker ? handleTaskerClick(item) : null
                    }
                  >
                    

                    <td
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {item.name}
                        </div>
                        <div className="font-normal text-gray-500">
                          {item.email}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>{item.first_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          {item.is_active ? (
                            <button
                              className="bg-blue-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleModal(
                                  item.id,
                                  "Are you sure you want to deactivate this user?",
                                  handleUserAction
                                );
                              }}
                            >
                              Active
                            </button>
                          ) : (
                            <button
                              className="bg-orange-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-green-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleModal(
                                  item.id,
                                  "Are you sure you want to activate this user?",
                                  handleUserAction
                                );
                              }}
                            >
                              Inactive
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}

export default UserList;
