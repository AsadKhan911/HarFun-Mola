import React, { useState, useEffect } from "react";
import axios from "axios";
import { AdminBaseUrl } from "../../routes/base-url";
import {
  Table,
  Select,
  DatePicker,
  Input,
  Button,
  Tabs,
  Card,
  Tag,
  Divider,
  message,
  Descriptions,
  Space,
  Modal
} from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import moment from "moment";

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminPayments = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    method: "",
    dateRange: []
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchOrderNumber, setSearchOrderNumber] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [transferList, setTransferList] = useState([]);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const statusOptions = [
    { value: "Pending", label: "Pending", color: "orange" },
    { value: "Completed", label: "Completed", color: "green" },
    { value: "Cancelled", label: "Cancelled", color: "red" }
  ];

  const paymentMethodOptions = [
    { value: "COD", label: "Cash on Delivery" },
    { value: "CARD", label: "Credit/Debit Card" }
  ];

  const paymentColumns = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text) => `#${text}`
    },
    {
      title: "Customer",
      dataIndex: ["user", "fullName"],
      key: "user"
    },
    {
      title: "Service",
      dataIndex: ["service", "serviceName"],
      key: "service"
    },
    {
      title: "Amount",
      dataIndex: "selectedPricingOption",
      key: "amount",
      render: (option) => `$${option?.price || 0}`
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => (
        <Tag color={method === "CARD" ? "blue" : "purple"}>
          {method === "CARD" ? "Card" : "Cash on Delivery"}
        </Tag>
      )
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "status",
      render: (status) => {
        let color = "";
        let icon = null;
        
        switch (status) {
          case "Completed":
            color = "green";
            icon = <CheckCircleOutlined />;
            break;
          case "Pending":
            color = "orange";
            icon = <SyncOutlined spin />;
            break;
          case "Cancelled":
            color = "red";
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = "gray";
        }
        
        return (
          <Tag icon={icon} color={color}>
            {status}
          </Tag>
        );
      }
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => moment(date).format("MMM D, YYYY h:mm A")
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setPaymentDetails(record);
              setActiveTab("details");
            }}
          >
            Details
          </Button>
          {record.paymentMethod === "CARD" && record.paymentStatus === "Completed" && (
            <Button
              size="small"
              danger
              onClick={() => {
                setSelectedPayment(record);
                setIsRefundModalVisible(true);
              }}
            >
              Refund
            </Button>
          )}
        </Space>
      )
    }
  ];

  const fetchPayments = async (params = {}) => {
    setLoading(true);
    try {
      const query = {
        ...filters,
        page: pagination.current,
        limit: pagination.pageSize,
        ...params
      };
      
      if (filters.dateRange?.length === 2) {
        query.startDate = filters.dateRange[0].format("YYYY-MM-DD");
        query.endDate = filters.dateRange[1].format("YYYY-MM-DD");
      }
      
      const res = await axios.get(`${AdminBaseUrl}/admin/payments`, {
        params: query
      });
      
      setPayments(res.data.payments);
      setPagination({
        ...pagination,
        total: res.data.totalCount,
        current: params.page || pagination.current
      });
    } catch (err) {
      message.error("Failed to fetch payments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentDetails = async (orderNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(`${AdminBaseUrl}/admin/payments/${orderNumber}`);
      setPaymentDetails(res.data.booking);
    } catch (err) {
      message.error("Failed to fetch payment details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

   async (orderNumber) => {
    setLoading(true);
    try {
      await axios.post(`${AdminBaseUrl}/admin/payments/mark-completed`, {
        orderNumber
      });
      message.success("Payment marked as completed");
      fetchPayments();
      if (paymentDetails?.orderNumber === orderNumber) {
        fetchPaymentDetails(orderNumber);
      }
    } catch (err) {
      message.error("Failed to mark payment as completed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    setLoading(true);
    try {
       await axios.post(`${AdminBaseUrl}/admin/payments/refund`, {
        paymentIntentId: selectedPayment.paymentIntentId,
        amount: refundAmount,
        reason: refundReason
      });
      message.success("Refund processed successfully");
      setIsRefundModalVisible(false);
      setRefundAmount("");
      setRefundReason("");
      fetchPayments();
      if (paymentDetails?.orderNumber === selectedPayment.orderNumber) {
        fetchPaymentDetails(selectedPayment.orderNumber);
      }
    } catch (err) {
      message.error("Failed to process refund");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${AdminBaseUrl}/admin/stripe/transfers`);
      setTransferList(res.data.transfers.data);
    } catch (err) {
      message.error("Failed to fetch transfers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "all") {
      fetchPayments();
    } else if (activeTab === "transfers") {
      fetchTransfers();
    }
  }, [activeTab, filters, pagination.current]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const renderPaymentDetails = () => {
    if (!paymentDetails) return null;

    return (
      <Card
        title={`Payment Details - Order #${paymentDetails.orderNumber}`}
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setActiveTab("all")}
          >
            Back to Payments
          </Button>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Customer">
            {paymentDetails.user?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Service">
            {paymentDetails.service?.serviceName}
          </Descriptions.Item>
          <Descriptions.Item label="Amount">
            ${paymentDetails.selectedPricingOption?.price}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            <Tag color={paymentDetails.paymentMethod === "CARD" ? "blue" : "purple"}>
              {paymentDetails.paymentMethod === "CARD" ? "Card" : "Cash on Delivery"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            <Tag
              color={
                paymentDetails.paymentStatus === "Completed"
                  ? "green"
                  : paymentDetails.paymentStatus === "Pending"
                  ? "orange"
                  : "red"
              }
            >
              {paymentDetails.paymentStatus}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Date">
            {moment(paymentDetails.createdAt).format("MMM D, YYYY h:mm A")}
          </Descriptions.Item>
          {paymentDetails.paymentMethod === "CARD" && (
            <>
              <Descriptions.Item label="Payment Intent ID">
                {paymentDetails.paymentIntentId || "N/A"}
              </Descriptions.Item>
              {paymentDetails.paymentStatus === "Completed" && (
                <Descriptions.Item label="Actions">
                  <Button
                    danger
                    onClick={() => {
                      setSelectedPayment(paymentDetails);
                      setIsRefundModalVisible(true);
                    }}
                  >
                    Process Refund
                  </Button>
                </Descriptions.Item>
              )}
            </>
          )}
        </Descriptions>
      </Card>
    );
  };

  const renderTransfers = () => {
    return (
      <Table
        columns={[
          {
            title: "Transfer ID",
            dataIndex: "id",
            key: "id"
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `$${(amount / 100).toFixed(2)}`
          },
          {
            title: "Currency",
            dataIndex: "currency",
            key: "currency"
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
              <Tag
                color={
                  status === "paid"
                    ? "green"
                    : status === "pending"
                    ? "orange"
                    : "red"
                }
              >
                {status.toUpperCase()}
              </Tag>
            )
          },
          {
            title: "Date",
            dataIndex: "created",
            key: "date",
            render: (date) => moment.unix(date).format("MMM D, YYYY h:mm A")
          }
        ]}
        dataSource={transferList}
        rowKey="id"
        loading={loading}
      />
    );
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "24px" }}>
        <DollarOutlined /> Payment Management
      </h2>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarExtraContent={
          activeTab === "all" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <Select
                placeholder="Payment Status"
                style={{ width: 180 }}
                allowClear
                value={filters.status}
                onChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                {statusOptions.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Payment Method"
                style={{ width: 180 }}
                allowClear
                value={filters.method}
                onChange={(value) =>
                  setFilters({ ...filters, method: value })
                }
              >
                {paymentMethodOptions.map((method) => (
                  <Option key={method.value} value={method.value}>
                    {method.label}
                  </Option>
                ))}
              </Select>
              <RangePicker
                onChange={(dates) =>
                  setFilters({ ...filters, dateRange: dates })
                }
                value={filters.dateRange}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => fetchPayments({ page: 1 })}
              >
                Search
              </Button>
            </div>
          )
        }
      >
        <TabPane
          tab={
            <span>
              <FileDoneOutlined />
              All Payments
            </span>
          }
          key="all"
        >
          {activeTab === "all" && (
            <Table
              columns={paymentColumns}
              dataSource={payments}
              rowKey="_id"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
              scroll={{ x: true }}
            />
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileDoneOutlined />
              Payment Details
            </span>
          }
          key="details"
        >
          {activeTab === "details" ? (
            paymentDetails ? (
              renderPaymentDetails()
            ) : (
              <Card>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Input
                    placeholder="Enter Order Number"
                    value={searchOrderNumber}
                    onChange={(e) => setSearchOrderNumber(e.target.value)}
                  />
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => fetchPaymentDetails(searchOrderNumber)}
                    loading={loading}
                  >
                    Search
                  </Button>
                </div>
              </Card>
            )
          ) : null}
        </TabPane>
        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Transfers
            </span>
          }
          key="transfers"
        >
          {activeTab === "transfers" && renderTransfers()}
        </TabPane>
      </Tabs>

      <Modal
        title="Process Refund"
        visible={isRefundModalVisible}
        onOk={handleRefund}
        onCancel={() => setIsRefundModalVisible(false)}
        confirmLoading={loading}
      >
        {selectedPayment && (
          <>
            <p>
              Order #: <strong>{selectedPayment.orderNumber}</strong>
            </p>
            <p>
              Amount:{" "}
              <strong>
                ${selectedPayment.selectedPricingOption?.price}
              </strong>
            </p>
            <Divider />
            <Input
              placeholder="Refund Amount"
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <Input.TextArea
              placeholder="Refund Reason (optional)"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminPayments;