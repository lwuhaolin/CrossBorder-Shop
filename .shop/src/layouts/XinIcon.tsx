import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const XinIcon: React.FC<{
  value?: React.Key;
  mapping?: Record<React.Key, React.ReactElement | React.ReactElement[]>;
}> = (props) => {
  const { value, mapping } = props;
  const [index, setIndex] = useState<number>(0);
  const [elements, setElements] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const target = mapping && value ? mapping[value] : undefined;

    if (target) {
      if (target instanceof Array) {
        setElements([...target]);
      } else {
        setElements([target]);
      }
    }

    return () => setElements([]);
  }, [mapping, value]);

  useEffect(() => {
    const changer = setInterval(() => {
      setIndex((_index_) => (_index_ + 1) % elements.length);
    }, 1000);

    return () => {
      setIndex(0);
      clearInterval(changer);
    };
  }, [elements]);

  return (
    elements[index] || (
      <Spin
        style={{
          marginLeft: -0.824,
          marginTop: 0.824 * 4,
        }}
        indicator={
          <SyncOutlined
            spin
            style={{
              color: '#fff',
            }}
          />
        }
      />
    )
  );
};

XinIcon.defaultProps = {
  value: undefined,
  mapping: undefined,
};

export default XinIcon;
