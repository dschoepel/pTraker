import { useContext } from "react";
import { Form, InputNumber, DatePicker, Tooltip, Button, Space } from "antd";
import dayjs from "dayjs";

import PortfolioService from "../services/portfolio.service";
import { PortfolioChangeContext } from "../store/portfolioChange.context";

import "./AddLotForm.css";

function AddLotForm({ portfolioKey, assetId, lastPrice }) {
  const [form] = Form.useForm();
  const [listChanged, setListChanged] = useContext(PortfolioChangeContext);

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

  return (
    <Form
      form={form}
      name="add_lots"
      layout={"inline"}
      size={"small"}
      initialValues={{
        addQty: 1,
        addUnitPrice: lastPrice,
        addAcquiredDate: dayjs(),
      }}
      onFinish={addLotClicked}
    >
      <Space size={1} wrap={true} direction="horizontal">
        <Tooltip title={"Acquired Date"} placement="leftTop">
          <Form.Item
            name="addAcquiredDate"
            // label={"Date"}
            // style={{ marginLeft: "2em" }}
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker
              placeholder="Lot Aquired Date"
              // defaultPickerValue={dayjs()}
              value={dayjs()}
            />
          </Form.Item>
        </Tooltip>
        <Tooltip title={"Unit Price"}>
          <Form.Item
            name="addUnitPrice"
            // label={"Unit Price"}
            rules={[
              { required: true, message: "Please enter a unit price!" },
              {
                type: "number",
                min: 0.00001,
                message: "Price must be greater than zero!",
              },
            ]}
          >
            <InputNumber
              placeholder=" Price"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={lastPrice}
            />
          </Form.Item>
        </Tooltip>
        <Tooltip title={"Quantity"}>
          <Form.Item
            name="addQty"
            // label={"Qty"}
            rules={[
              { required: true, message: "Please enter a quantity!" },
              {
                type: "number",
                min: 0.00001,
                message: "Qty must be greater than zero!",
              },
            ]}
          >
            <InputNumber placeholder=" Qty" />
          </Form.Item>
        </Tooltip>
        <Button size="small" type="primary" htmlType="submit">
          + Add Lot
        </Button>
      </Space>
    </Form>
  );
}

export default AddLotForm;
