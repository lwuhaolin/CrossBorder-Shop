import React, { Dispatch, SetStateAction } from "react";
import { DrawerForm, DrawerFormProps } from "@ant-design/pro-components";
import Package from "@/pages/entity/package/components/Package";
import { Button, Divider, message, Table } from "antd";

const Selector: React.FC<
  DrawerFormProps & {
    bag: [
      Record<string, any>[],
      Dispatch<SetStateAction<Record<string, any>[]>>
    ];
  }
> = (props) => {
  return (
    <DrawerForm
      drawerProps={{
        placement: "bottom",
      }}
      layout="vertical"
      title={"挑选包装材料"}
      submitter={false}
      {...props}
    >
      <Package
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            name: record.name,
          }),
        }}
        tableAlertOptionRender={({ selectedRows, onCleanSelected }) => [
          <Button key="price" type="text">
            ￥
            {selectedRows.reduce(
              (previousValue, currentValue) =>
                previousValue + currentValue.price,
              0
            )}
          </Button>,
          <Divider key="spliter" type="vertical" />,
          <Button
            key="add"
            type="primary"
            onClick={() => {
              selectedRows.forEach((entity) => {
                const good = props.bag[0].find(
                  (_good_) =>
                    _good_.resourceType === 1 && _good_.id === entity.id
                );

                if (good) {
                  message.warning(
                    `重复的包装材料 ${entity.name} 并没有被添加到购物车`
                  );
                } else {
                  props.bag[1]((bag) => [
                    ...bag,
                    {
                      ...entity,
                      amount: 1,
                      resourceType: 1,
                      resourceId: entity.id,
                    },
                  ]);
                }

                onCleanSelected();
              });

              message.success(`添加成功`);
            }}
          >
            加入购物车
          </Button>,
        ]}
      />
    </DrawerForm>
  );
};

export default Selector;
