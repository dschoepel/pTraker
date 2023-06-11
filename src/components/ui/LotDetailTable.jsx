import React, { Fragment, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Table,
  Space,
  Typography,
  Popconfirm,
  Input,
  Form,
  InputNumber,
  DatePicker,
  Button,
  Tooltip,
  Modal,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { TbMinusVertical } from "react-icons/tb";
import { BsTrash } from "react-icons/bs";

import PortfolioService from "../services/portfolio.service";
import { PortfolioChangeContext } from "../store/portfolioChange.context";
import AddLotForm from "../forms/AddLotForm";
import FormattedDate from "./FormattedDate";
import FormattedNumber from "./FormattedNumber";
import "./LotDetailTable.css";

const dateChanged = (date, dateString) => {
  console.log("Date Changed: ", dayjs(date).toISOString(), dateString);
};

// The EditableCell component is used in the LotDetailTable component.
// It defines cells that can be edited by the user.
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  // Set form field type for cell
  let inputNode = <Input />;
  // Construct table data column corresponding to inputType
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

// The LotDetailTable component displays the details of each lot in a portfolio
// and allows the user to edit the lot details.
// The component is used in the PortfolioDetail component.
// The component is a child of the PortfolioDetail component and is a parent
// of the AddLotForm component.
// The component uses the PortfolioChangeContext to notify the PortfolioDetail component when a
// lot is added, updated or deleted.
// The parameters passed to the component are: lotArray, portfolioKey, assetId and lastPrice
//Props:
// lotArray: Holds details of each lot \
// portfolioKey: Object holds user id and portfolio id for new lots
// assetId: Asset id to assign to new lots
function LotDetailTable({ lotArray, portfolioKey, assetId, lastPrice }) {
  const [editingKey, setEditingKey] = useState("");
  const [data, setData] = useState(lotArray);
  const [isAddLotModalOpen, setIsAddLotModalOpen] = useState(false);
  const [assetSymbolToAddLot, setAssetSymbolToAddLot] = useState("");
  const [form] = Form.useForm();
  const [listChanged, setListChanged] = useContext(PortfolioChangeContext);
  const navigate = useNavigate();
  console.log("Keys: ", portfolioKey, assetId, lastPrice);

  // Set status for editing table row
  const isEditing = (record) => record.key === editingKey;

  // Set Fields to allow edit of the lot detail
  const edit = (_value, record) => {
    console.log("Edit clicked:", record, record.lotId);
    form.setFieldsValue({
      ...record,
      lotAcquiredDate: dayjs(record.lotAcquiredDate),
      lotUnitPrice: record.lotUnitPrice,
      lotQty: record.lotQty,
    });
    setEditingKey(record.key);
  };

  // Save changes to lot key = lotId
  const save = async (record) => {
    try {
      const row = await form.validateFields();
      console.log("Save (update) changes to row: ", row, record);
      const lotDetail = {
        acquiredDate: row.lotAcquiredDate,
        qty: row.lotQty,
        unitPrice: row.lotUnitPrice,
      };

      PortfolioService.editLotInPortfolio(record.lotId, lotDetail)
        .then((response) => {
          // response object {success, data, statusCode}
          const { success, data } = response;
          // data object {errorFlag, errorStatus, email, message}
          const { message } = data.data;
          console.log(
            "updated lot: success, message, data ",
            success,
            message,
            data
          );
          if (success) {
            setListChanged({
              changed: true,
              changeType: "UPDATED_LOT",
              portfolioId: portfolioKey.portfolioId,
            });

            console.log("portfolioContext - list changed?: ", listChanged);
          }
        })
        .catch((error) => {
          console.log(
            "Something went wrong updating lot in the portfolio: ",
            error
          );
        });
      setEditingKey("");
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  //Cancel lot row edit
  const cancel = () => {
    setEditingKey("");
  };

  const handleLotDelete = (_value, record) => {
    console.log("Delete Clicked for record: ", _value, record);

    PortfolioService.deleteLotFromPortfolio(record.lotId)
      .then((response) => {
        // response object {success, data, statusCode}
        // TODO Check for valid delete response is not undefined
        let success = false;
        let data = {};
        if (response) {
          success = response.success;
          data = response.data;
        }
        const { message } = data?.data;
        console.log(
          "deleted lot: success, message, data ",
          success,
          message,
          data
        );

        if (success) {
          setListChanged({
            changed: true,
            changeType: "DELETED_LOT",
            portfolioId: portfolioKey.portfolioId,
          });
          console.log(lotArray);

          console.log(
            "portfolioContext - list changed?: ",
            success,
            listChanged
          );
        }
      })
      .catch((error) => {
        console.log(
          `Something went wrong deleting lot ${record.lotId} from portfolio: `,
          error
        );
      });
  };

  const addLot = async () => {
    console.log("addLot clicked: ", portfolioKey, lastPrice, assetId);
    const assetInfo = await PortfolioService.getAssetDetail(assetId);
    console.log("AssetInfo", assetInfo);
    if (!assetInfo.success) {
      if (assetInfo.statusCode === 403) {
        navigate("/expiredLogin");
      }
    }
    const { assetDisplayName, assetSymbol, assetShortName } =
      assetInfo.assetDetail;
    const displayName = assetDisplayName
      ? `(${assetDisplayName})`
      : `(${assetShortName})`;
    const lotModalTitle = `Add a Lot to ${assetSymbol} ${displayName}`;
    setAssetSymbolToAddLot(lotModalTitle);
    setIsAddLotModalOpen(true);
  };

  const addLotClicked = ({ addAcquiredDate, addUnitPrice, addQty }) => {
    console.log(
      "Add Lot Clicked",
      dayjs(addAcquiredDate).toISOString(),
      addUnitPrice,
      addQty
    );
    const lotDetail = {
      qty: addQty,
      acquiredDate: addAcquiredDate,
      unitPrice: addUnitPrice,
    };

    PortfolioService.addLotToPortfolio(
      portfolioKey.portfolioId,
      assetId,
      lotDetail
    )
      .then((response) => {
        // response object {success, data, statusCode}
        const { success, data } = response;
        // data object {errorFlag, errorStatus, email, message}
        const { message } = data.data;
        console.log(
          "added lot: success, message, data ",
          success,
          message,
          data
        );
        if (success) {
          setListChanged({
            changed: true,
            changeType: "ADDED_LOT",
            portfolioId: portfolioKey.portfolioId,
          });
          console.log(
            "portfolioContext - list changed?: ",
            success,
            listChanged
          );
        }
      })
      .catch((error) => {
        console.log("Something went wrong adding lot to portfolio: ", error);
      });
  };

  // Set column definitions for lot detail table
  const columns = [
    {
      title: "Date",
      dataIndex: "lotAcquiredDate",
      className: "port-table-lot-row",
      key: "lotAcquiredDate",
      width: "20%",
      editable: true,
      render: (value, row, index) => {
        return <FormattedDate dateString={value} title="Lot:" />;
      },
    },
    {
      title: "Price",
      dataIndex: "lotUnitPrice",
      key: "lotUnitPrice",
      width: "15%",
      className: "port-table-lot-row",
      editable: true,
      render: (value) => {
        return <FormattedNumber value={value} type="CURRENCY" />;
      },
    },
    {
      title: "Qty",
      dataIndex: "lotQty",
      key: "lotQty",
      width: "10%",
      className: "port-table-lot-row",
      editable: true,
      render: (value) => {
        return <FormattedNumber value={value} type="NUMBER" />;
      },
    },
    {
      title: "Book Value",
      dataIndex: "lotCostBasis",
      key: "lotCostBasis",
      width: "15%",
      responsive: ["md"],
      className: "port-table-lot-row",
      render: (value) => {
        return <FormattedNumber value={value} type="CURRENCY" />;
      },
    },
    {
      title: "Return",
      dataIndex: "lotTotalReturn",
      key: "lotTotalReturn",
      responsive: ["md"],
      className: "port-table-lot-row",
      render: (value) => {
        return (
          <FormattedNumber
            value={value}
            type="CURRENCY"
            color={true}
            digits={2}
          />
        );
      },
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "key",
      className: "port-table-lot-row",
      render: (value, record) => {
        console.log("value, record: ", value, record);
        const editable = isEditing(record);
        console.log("editable value - ", editable);
        return !editable ? (
          <Fragment>
            <Space size="small">
              <Link onClick={() => edit(value, record)}>
                <EditOutlined />
              </Link>
              <TbMinusVertical />
              <Popconfirm
                title="Delete lot?"
                okType="primary"
                placement="left"
                color="var(--dk-gray-300)"
                onConfirm={() => handleLotDelete(value, record)}
              >
                <Link>
                  <BsTrash />
                </Link>
              </Popconfirm>
            </Space>
          </Fragment>
        ) : (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Typography.Link>Cancel</Typography.Link>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  // Set table row columns
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record, rowIndex) => ({
        record,
        inputType:
          col.dataIndex === "lotAcquiredDate" ? "datePicker" : "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record, rowIndex),
      }),
    };
  });

  const handleCancel = () => {
    setAssetSymbolToAddLot("");
    setIsAddLotModalOpen(false);
  };
  const handleOk = () => {};

  return (
    <Fragment>
      {lotArray?.length > 0 ? (
        <Form form={form} component={false} className="port-table-lot">
          <Table
            dataSource={lotArray}
            components={{ body: { cell: EditableCell } }}
            columns={mergedColumns}
            pagination={false}
            showHeader={true}
            className="port-table-lot"
            scroll={{ x: true }}
            bordered={false}
            rowClassName={(record, index) =>
              index === 0 ? "port-temp-classname" : "port-temp-not-zero"
            }
            // tableLayout="fixed"
          ></Table>
        </Form>
      ) : null}

      {isAddLotModalOpen ? (
        <Modal
          destroyOnClose={true}
          bodyStyle={{ backgroundColor: "var(--dk-dark-bg)" }}
          title={assetSymbolToAddLot}
          footer={null}
          okText="Add Lot"
          open={isAddLotModalOpen}
          onCancel={handleCancel}
          maskClosable={false}
          wrapClassName="lot-add-modal-style"
          onOk={handleOk}
          width={"40em"}
        >
          <AddLotForm
            portfolioKey={portfolioKey}
            assetId={assetId}
            lastPrice={lastPrice}
          />
        </Modal>
      ) : null}

      <Fragment>
        {!isAddLotModalOpen ? (
          <Button
            style={{ marginTop: "1rem", marginLeft: "1rem" }}
            type="primary"
            onClick={addLot}
          >
            Add Lot
          </Button>
        ) : null}
      </Fragment>
    </Fragment>
  );
}

export default LotDetailTable;
