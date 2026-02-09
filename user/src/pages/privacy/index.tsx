import React from "react";
import { Typography, Card, Anchor } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const { Title, Paragraph } = Typography;
const { Link } = Anchor;

const Privacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.privacy}>
      <div className={styles.banner}>
        <SafetyOutlined className={styles.bannerIcon} />
        <Title level={1} className={styles.bannerTitle}>
          隐私政策
        </Title>
        <Paragraph className={styles.bannerDesc}>
          我们重视并保护您的个人隐私
        </Paragraph>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <Card className={styles.card}>
            <div id="section1">
              <Title level={2}>1. 信息收集</Title>
              <Paragraph>我们收集的信息类型包括但不限于：</Paragraph>
              <ul>
                <li>
                  <strong>账户信息：</strong>
                  当您注册账户时，我们会收集您的姓名、电子邮箱、电话号码等基本信息。
                </li>
                <li>
                  <strong>订单信息：</strong>
                  包括您购买的商品、收货地址、支付信息等。
                </li>
                <li>
                  <strong>设备信息：</strong>
                  包括您使用的设备类型、操作系统、浏览器类型、IP地址等。
                </li>
                <li>
                  <strong>使用信息：</strong>
                  您在使用我们服务时的浏览记录、搜索记录、点击记录等。
                </li>
              </ul>
            </div>

            <div id="section2">
              <Title level={2}>2. 信息使用</Title>
              <Paragraph>我们收集和使用您的个人信息用于以下目的：</Paragraph>
              <ul>
                <li>处理您的订单和提供客户服务</li>
                <li>改善我们的产品和服务</li>
                <li>向您发送订单更新、促销信息等</li>
                <li>防止欺诈和滥用行为</li>
                <li>遵守法律法规要求</li>
              </ul>
            </div>

            <div id="section3">
              <Title level={2}>3. 信息共享</Title>
              <Paragraph>
                我们不会出售您的个人信息。我们可能在以下情况下共享您的信息：
              </Paragraph>
              <ul>
                <li>
                  <strong>服务提供商：</strong>
                  与帮助我们运营业务的第三方服务提供商，如支付处理商、物流公司等。
                </li>
                <li>
                  <strong>法律要求：</strong>当法律要求或为保护我们的权利时。
                </li>
                <li>
                  <strong>业务转让：</strong>在合并、收购或资产出售的情况下。
                </li>
              </ul>
            </div>

            <div id="section4">
              <Title level={2}>4. 信息安全</Title>
              <Paragraph>我们采取多种安全措施来保护您的个人信息：</Paragraph>
              <ul>
                <li>使用SSL加密技术保护数据传输</li>
                <li>实施严格的访问控制和权限管理</li>
                <li>定期进行安全审计和漏洞扫描</li>
                <li>对员工进行数据保护培训</li>
              </ul>
              <Paragraph>
                尽管我们采取了这些措施，但请注意，没有任何互联网传输或电子存储方法是100%安全的。
              </Paragraph>
            </div>

            <div id="section5">
              <Title level={2}>5. Cookie使用</Title>
              <Paragraph>我们使用Cookie和类似技术来：</Paragraph>
              <ul>
                <li>记住您的登录状态和偏好设置</li>
                <li>分析网站流量和用户行为</li>
                <li>提供个性化的内容和广告</li>
              </ul>
              <Paragraph>
                您可以通过浏览器设置管理Cookie。但请注意，禁用Cookie可能影响某些功能的使用。
              </Paragraph>
            </div>

            <div id="section6">
              <Title level={2}>6. 您的权利</Title>
              <Paragraph>您对自己的个人信息享有以下权利：</Paragraph>
              <ul>
                <li>
                  <strong>访问权：</strong>
                  您有权访问我们持有的关于您的个人信息。
                </li>
                <li>
                  <strong>更正权：</strong>您可以要求更正不准确的个人信息。
                </li>
                <li>
                  <strong>删除权：</strong>
                  在某些情况下，您可以要求删除您的个人信息。
                </li>
                <li>
                  <strong>限制处理权：</strong>
                  您可以要求限制对您个人信息的处理。
                </li>
                <li>
                  <strong>数据可携权：</strong>
                  您可以要求以结构化、常用和机器可读的格式获取您的数据。
                </li>
              </ul>
            </div>

            <div id="section7">
              <Title level={2}>7. 儿童隐私</Title>
              <Paragraph>
                我们的服务不面向13岁以下的儿童。我们不会有意收集13岁以下儿童的个人信息。
                如果您发现我们收集了儿童的信息，请立即联系我们。
              </Paragraph>
            </div>

            <div id="section8">
              <Title level={2}>8. 政策更新</Title>
              <Paragraph>
                我们可能会不时更新本隐私政策。我们会在本页面发布新的隐私政策，
                并更新"最后更新日期"。重大变更时，我们会通过电子邮件或网站通知您。
              </Paragraph>
              <Paragraph>
                <strong>最后更新日期：</strong>2026年2月9日
              </Paragraph>
            </div>

            <div id="section9">
              <Title level={2}>9. 联系我们</Title>
              <Paragraph>
                如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
              </Paragraph>
              <ul>
                <li>电子邮箱：privacy@crossbordershop.com</li>
                <li>电话：+86-123-4567-8900</li>
                <li>地址：中国上海市浦东新区世纪大道1000号</li>
              </ul>
            </div>
          </Card>
        </div>

        <div className={styles.sidebar}>
          <Card className={styles.sidebarCard}>
            <Title level={4}>目录</Title>
            <Anchor
              offsetTop={80}
              items={[
                { key: "section1", href: "#section1", title: "信息收集" },
                { key: "section2", href: "#section2", title: "信息使用" },
                { key: "section3", href: "#section3", title: "信息共享" },
                { key: "section4", href: "#section4", title: "信息安全" },
                { key: "section5", href: "#section5", title: "Cookie使用" },
                { key: "section6", href: "#section6", title: "您的权利" },
                { key: "section7", href: "#section7", title: "儿童隐私" },
                { key: "section8", href: "#section8", title: "政策更新" },
                { key: "section9", href: "#section9", title: "联系我们" },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
