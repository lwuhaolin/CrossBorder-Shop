import React, { useEffect, useRef } from "react";
import { LineLayer, Scene } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import { Button, Modal, ModalProps, Space, Tag } from "antd";
import { ProCard } from "@ant-design/pro-components";
import { PresetColors } from "antd/es/theme/interface/presetColors";
import { AppstoreTwoTone, PhoneOutlined } from "@ant-design/icons";

const Viewer: React.FC<
  ModalProps & {
    entity?: Record<string, any>;
  }
> = (props) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.open) {
      const watcher = setInterval(() => {
        if (container.current) {
          clearInterval(watcher);
          //
          const scene = new Scene({
            id: container.current,
            map: new GaodeMap({
              // center: [ 116.3956, 39.9392 ],
              zoom: 19,
              style: "light",
            }),
            logoPosition: "topleft",
          });
          //
          scene.on("loaded", () => {
            fetch(
              "https://gw.alipayobjects.com/os/basement_prod/0d2f0113-f48b-4db9-8adc-a3937243d5a3.json"
            )
              .then((res) => res.json())
              .then((data) => {
                const layer = new LineLayer({})
                  .source(data)
                  .size(1.5)
                  .shape("line")
                  .color("标准名称", ["#5B8FF9", "#5CCEA1", "#F6BD16"])
                  .style({
                    lineType: "dash",
                    dashArray: [5, 5],
                  });
                scene.addLayer(layer);
              });
          });
        }
      }, 819);

      return () => clearInterval(watcher);
    }

    return () => {};
  }, [props.open]);

  return (
    <Modal
      style={{
        top: 24,
      }}
      width="90%"
      maskClosable
      destroyOnClose
      footer={false}
      {...props}
    >
      <div
        ref={container}
        style={{
          height: 604,
          margin: "-24px 0 0 -24px",
        }}
      />
      <ProCard
        style={{
          bottom: 24,
          position: "absolute",
          width: "calc(100% - 24px - 24px)",
          zIndex: 161,
        }}
        bodyStyle={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
        }}
        // hoverable
        bordered
        boxShadow
      >
        <Space>
          <Button type="ghost" icon={<AppstoreTwoTone />} />
          <Button type="ghost">{props.entity?.name}</Button>
          <Button type="ghost">{props.entity?.mobile}</Button>
        </Space>
        <Space>
          <Button type="primary" icon={<PhoneOutlined />}>
            联系
          </Button>
        </Space>
      </ProCard>
    </Modal>
  );
};

export default Viewer;
