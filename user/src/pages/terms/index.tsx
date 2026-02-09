import React from "react";
import { Typography, Card, Anchor } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const { Title, Paragraph } = Typography;

const Terms: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.terms}>
      <div className={styles.banner}>
        <FileTextOutlined className={styles.bannerIcon} />
        <Title level={1} className={styles.bannerTitle}>
          服务条款
        </Title>
        <Paragraph className={styles.bannerDesc}>
          使用本网站即表示您同意这些条款
        </Paragraph>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <Card className={styles.card}>
            <div id="section1">
              <Title level={2}>1. 接受条款</Title>
              <Paragraph>
                欢迎使用CrossBorder Shop。通过访问或使用我们的网站和服务，
                您同意受本服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。
              </Paragraph>
            </div>

            <div id="section2">
              <Title level={2}>2. 账户注册</Title>
              <Paragraph>
                为了使用某些功能，您需要创建一个账户。在注册时，您同意：
              </Paragraph>
              <ul>
                <li>提供准确、完整和最新的信息</li>
                <li>维护账户信息的准确性</li>
                <li>对您账户下的所有活动负责</li>
                <li>保护您的密码安全</li>
                <li>立即通知我们任何未经授权的使用</li>
              </ul>
              <Paragraph>
                您必须年满18岁才能创建账户。未成年人使用本服务需获得监护人同意。
              </Paragraph>
            </div>

            <div id="section3">
              <Title level={2}>3. 使用规则</Title>
              <Paragraph>在使用我们的服务时，您同意不会：</Paragraph>
              <ul>
                <li>违反任何法律法规</li>
                <li>侵犯他人的知识产权</li>
                <li>发布虚假、误导性或欺诈性内容</li>
                <li>上传恶意软件或病毒</li>
                <li>骚扰、威胁或攻击其他用户</li>
                <li>试图未经授权访问我们的系统</li>
                <li>使用自动化工具抓取网站内容</li>
              </ul>
            </div>

            <div id="section4">
              <Title level={2}>4. 订单和支付</Title>
              <Paragraph>
                <strong>4.1 订单确认：</strong>
                当您下订单时，我们会向您发送确认邮件。
                该邮件仅表示我们收到了您的订单，不构成我们接受订单的确认。
              </Paragraph>
              <Paragraph>
                <strong>4.2 价格：</strong>所有价格均以网站上显示的货币为准。
                我们保留随时更改价格的权利，但这不会影响您已下的订单。
              </Paragraph>
              <Paragraph>
                <strong>4.3 支付：</strong>您同意在下单时提供有效的支付方式。
                如果支付失败，我们可能取消您的订单。
              </Paragraph>
              <Paragraph>
                <strong>4.4 取消订单：</strong>
                我们保留因库存不足、价格错误或其他原因
                拒绝或取消任何订单的权利。
              </Paragraph>
            </div>

            <div id="section5">
              <Title level={2}>5. 配送</Title>
              <Paragraph>
                我们会尽力在预计时间内配送您的订单，但配送时间仅供参考。
                我们不对因延迟配送造成的损失承担责任。
              </Paragraph>
              <Paragraph>
                商品的所有权和风险在您签收时转移给您。请在签收时检查商品是否完好。
              </Paragraph>
            </div>

            <div id="section6">
              <Title level={2}>6. 退货和退款</Title>
              <Paragraph>
                我们提供7天无理由退货服务。退货政策的详细信息请参见我们的退货页面。
              </Paragraph>
              <Paragraph>
                退款将在我们收到退货并验收通过后的3-5个工作日内处理，
                退款将原路返回至您的支付账户。
              </Paragraph>
            </div>

            <div id="section7">
              <Title level={2}>7. 知识产权</Title>
              <Paragraph>
                本网站上的所有内容，包括但不限于文字、图片、商标、logo、软件等，
                均为CrossBorder Shop或其许可方的财产，受知识产权法保护。
              </Paragraph>
              <Paragraph>
                未经我们明确书面许可，您不得复制、修改、分发或以任何方式使用这些内容。
              </Paragraph>
            </div>

            <div id="section8">
              <Title level={2}>8. 免责声明</Title>
              <Paragraph>
                我们的服务按"原样"提供，不提供任何明示或暗示的保证。
                在法律允许的最大范围内，我们不对以下情况承担责任：
              </Paragraph>
              <ul>
                <li>服务的可用性、准确性或可靠性</li>
                <li>使用服务导致的任何直接或间接损失</li>
                <li>第三方网站或服务的内容</li>
                <li>由于不可抗力造成的服务中断</li>
              </ul>
            </div>

            <div id="section9">
              <Title level={2}>9. 责任限制</Title>
              <Paragraph>
                在任何情况下，我们对您的总责任不超过您在导致责任的交易中支付的金额。
                我们不对任何间接、特殊、惩罚性或后果性损失承担责任。
              </Paragraph>
            </div>

            <div id="section10">
              <Title level={2}>10. 修改条款</Title>
              <Paragraph>
                我们保留随时修改这些条款的权利。我们会在本页面发布更新后的条款，
                并更新"最后更新日期"。重大变更时，我们会提前通知您。
              </Paragraph>
              <Paragraph>
                在条款修改后继续使用我们的服务，即表示您接受修改后的条款。
              </Paragraph>
            </div>

            <div id="section11">
              <Title level={2}>11. 终止</Title>
              <Paragraph>
                我们保留随时暂停或终止您的账户或访问权限的权利，
                特别是在您违反这些条款的情况下。
              </Paragraph>
              <Paragraph>
                您可以随时通过联系客服关闭您的账户。账户关闭后，
                这些条款中关于知识产权、免责声明等条款仍然有效。
              </Paragraph>
            </div>

            <div id="section12">
              <Title level={2}>12. 争议解决</Title>
              <Paragraph>
                这些条款受中华人民共和国法律管辖。
                因使用本服务产生的任何争议应首先通过友好协商解决。
              </Paragraph>
              <Paragraph>
                如果协商不成，双方同意将争议提交至我们公司所在地有管辖权的人民法院解决。
              </Paragraph>
            </div>

            <div id="section13">
              <Title level={2}>13. 联系我们</Title>
              <Paragraph>
                如果您对这些条款有任何疑问，请通过以下方式联系我们：
              </Paragraph>
              <ul>
                <li>电子邮箱：legal@crossbordershop.com</li>
                <li>电话：+86-123-4567-8900</li>
                <li>地址：中国上海市浦东新区世纪大道1000号</li>
              </ul>
              <Paragraph>
                <strong>最后更新日期：</strong>2026年2月9日
              </Paragraph>
            </div>
          </Card>
        </div>

        <div className={styles.sidebar}>
          <Card className={styles.sidebarCard}>
            <Title level={4}>目录</Title>
            <Anchor
              offsetTop={80}
              items={[
                { key: "section1", href: "#section1", title: "接受条款" },
                { key: "section2", href: "#section2", title: "账户注册" },
                { key: "section3", href: "#section3", title: "使用规则" },
                { key: "section4", href: "#section4", title: "订单和支付" },
                { key: "section5", href: "#section5", title: "配送" },
                { key: "section6", href: "#section6", title: "退货和退款" },
                { key: "section7", href: "#section7", title: "知识产权" },
                { key: "section8", href: "#section8", title: "免责声明" },
                { key: "section9", href: "#section9", title: "责任限制" },
                { key: "section10", href: "#section10", title: "修改条款" },
                { key: "section11", href: "#section11", title: "终止" },
                { key: "section12", href: "#section12", title: "争议解决" },
                { key: "section13", href: "#section13", title: "联系我们" },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
