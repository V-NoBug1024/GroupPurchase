import * as React from 'react';
import * as qs from 'query-string';
import { Toast } from 'antd-mobile';
import TabbarView from '@components/TabbarView';
import Table from '@components/Table';
import TipText from '@components/TipText';
import ExportButton from '@components/ExportButton';
import EmptyView, { EmptyType } from '@components/EmptyView';
import { geGroupTabListInfo, getGroupListDataByTabs } from 'services/grouppurchase';
import './styles.scss';

const { memo, forwardRef, useState, useCallback } = React;

const tipText = (num: any) => {
    return `明细表共计${num}条记录，移动端仅显示前500条，可导出表格查看完整数据。`;
};

const getHead = (upText: string, downText: string) => {
    return (
        <div>
            <span>{upText}</span>
            <br />
            <span>{downText}</span>
        </div>
    );
};

const thAllList = [
    { text: '序号', key: 'orderId' },
    { text: '分类', key: 'categoryName' },
    {
        text: getHead('合计', '待处理'),
        key: 'totalNumber',
    },
    { text: '未审核', key: 'unreviewedNumber' },
    { text: '审核中', key: 'underReviewNumber' },
    { text: getHead('已提交', '门户审批'), key: 'reviewedNumber' },
    {
        text: getHead('门户', '审批中'),
        key: 'portalReviewNumber',
    },
    { text: getHead('流程', '驳回'), key: 'processRejectedNumber' },
    { text: '日期', key: 'createTime', width: 21 },
];

const thList = [
    { text: '序号', key: 'orderId' },
    { text: '经营小类', key: 'businessSmallClass', width: 20 },
    { text: '分类名称', key: 'categoryName', width: 20 },
    { text: '流水号', key: 'serialNumber', width: 20 },
    { text: '谈判单号', key: 'negotiationNumber', width: 20 },
    { text: getHead('大客户', '编码'), key: 'customerCode' },
    { text: getHead('大客户', '名称'), key: 'customerName' },
    { text: '条码', key: 'barcode', width: 20 },
    { text: '品名', key: 'itemName' },
    { text: '审核码', key: 'reviewCodeDesc' },
    { text: getHead('当前待处', '理人'), key: 'updateBy' },
    { text: getHead('团购开始', '日期'), key: 'saleStartDate' },
    { text: getHead('团购结束', '日期'), key: 'saleEndDate' },
    { text: getHead('会计', '期间'), key: 'curperiod' },
    { text: getHead('调价生效', '模块'), key: 'adjustModule' },
    { text: '所属机构', key: 'storeCode' },
    {
        text: getHead('营运中心', '名称'),
        key: 'storeName',
    },
    { text: '生效门店', key: 'effectiveStore' },
    { text: '日期时间', key: 'createTime' },
];

const thInfo = {
    '1': [
        { text: '序号', key: 'orderId' },
        { text: '分类', key: 'categoryName' },
        {
            text: getHead('合计', '待处理'),
            key: 'totalNumber',
        },
        { text: '未审核', key: 'unreviewedNumber' },
        { text: '审核中', key: 'underReviewNumber' },
        { text: getHead('已提交', '门户审批'), key: 'reviewedNumber' },
        {
            text: getHead('门户', '审批中'),
            key: 'portalReviewNumber',
        },
        { text: getHead('流程', '驳回'), key: 'processRejectedNumber' },
        { text: '日期', key: 'createTime', width: 21 },
    ],
    '2': [
        { text: '序号', key: 'orderId' },
        { text: '日期时间', key: 'createTime' },
        { text: '所属机构', key: 'storeCode' },
        {
            text: getHead('营运中心', '名称'),
            key: 'storeName',
        },
        { text: '经营小类', key: 'businessSmallClass', width: 20 },
        { text: '分类名称', key: 'categoryName', width: 20 },
        { text: '流水号', key: 'serialNumber', width: 20 },
        { text: '谈判单号', key: 'negotiationNumber', width: 20 },
        { text: getHead('大客户', '编码'), key: 'customerCode' },
        { text: getHead('大客户', '名称'), key: 'customerName' },
        { text: '条码', key: 'barcode', width: 20 },
        { text: '品名', key: 'itemName' },
        { text: getHead('会计', '期间'), key: 'curperiod' },
        { text: getHead('团购开始', '日期'), key: 'saleStartDate' },
        { text: getHead('团购结束', '日期'), key: 'saleEndDate' },
        { text: getHead('调价生效', '模块'), key: 'adjustModule' },
        { text: '生效门店', key: 'effectiveStore' },
        { text: '审核码', key: 'reviewCodeDesc' },
        { text: getHead('当前待处', '理人'), key: 'updateBy' },
    ],
    '3': [
        { text: '序号', key: 'orderId' },
        { text: '经营小类', key: 'businessSmallClass', width: 20 },
        { text: '分类名称', key: 'categoryName', width: 20 },
        { text: '流水号', key: 'serialNumber', width: 20 },
        { text: '谈判单号', key: 'negotiationNumber', width: 20 },
        { text: getHead('大客户', '编码'), key: 'customerCode' },
        { text: getHead('大客户', '名称'), key: 'customerName' },
        { text: '条码', key: 'barcode', width: 20 },
        { text: '品名', key: 'itemName' },
        { text: '审核码', key: 'reviewCodeDesc' },
        { text: getHead('当前待处', '理人'), key: 'updateBy' },
        { text: getHead('团购开始', '日期'), key: 'saleStartDate' },
        { text: getHead('团购结束', '日期'), key: 'saleEndDate' },
        { text: getHead('会计', '期间'), key: 'curperiod' },
        { text: getHead('调价生效', '模块'), key: 'adjustModule' },
        { text: '所属机构', key: 'storeCode' },
        {
            text: getHead('营运中心', '名称'),
            key: 'storeName',
        },
        { text: '生效门店', key: 'effectiveStore' },
        { text: '日期时间', key: 'createTime' },
    ],
};

const GroupPurchase = memo(
    forwardRef((props, ref) => {
        const searchData = qs.parse(window.location.search);
        const [selectIndex, setSelectIndex] = useState(0);
        const [data, setData] = useState({});
        const [tabList, setTabList] = useState([]);
        const [dataSource, setDataSource] = useState([]);
        // const [tabKey, setTabKey] = useState('1');

        // 获取TabList
        const getTabList = () => {
            const { msgid, type } = searchData;
            Toast.loading('加载中....');
            geGroupTabListInfo({ msgid, msgType: type })
                .then((res: any) => {
                    document.title = res.pageTitle || '';
                    const key = res.tabList[0].key;
                    getTableList(key);
                    setData(res || {});
                    setTabList(res.tabList || []);
                    setSelectIndex(+key === 2 ? 1 : 0);
                    // setTabKey(`${key || '1'}`);
                })
                .catch(() => {
                    Toast.hide();
                });
        };

        // 获取列表数据
        const getTableList = (type: any) => {
            if (!type) return false;
            const { msgid } = searchData;
            getGroupListDataByTabs({ msgid, tabType: type })
                .then((res: any) => {
                    Toast.hide();
                    let list = +type === 1 ? res.summaryList || [] : res.detailList || [];
                    setDataSource(list);
                })
                .catch(() => {
                    Toast.hide();
                });
        };

        React.useEffect(() => {
            getTabList();
        }, []);

        const handleTabbarChange = useCallback(
            (item: any, index: number) => {
                setDataSource([]);
                getTableList(item.key);
                Toast.loading('加载中....');
                setSelectIndex(index);
                // setTabKey(`${item.key}`);
            },
            [selectIndex]
        );

        const handleExportChange = useCallback(() => {
            const tabInfo = tabList.length > 1 ? tabList[selectIndex] : tabList[0];
            const url = `${data['redirectUri']}/groupBuyPriceAdjustWarnController/exportExcell?msgId=${searchData.msgid}&msgType=${tabInfo['key']}`;
            window.open(url);
        }, [selectIndex, tabList]);

        return (
            <div className="group-purchase">
                <h3>{`推送时间：${data['reportDate'] || ''}`}</h3>
                {tabList.length === 0 ? null : tabList.length === 2 ? (
                    <TabbarView
                        data={tabList}
                        valueKey="key"
                        selectIndex={selectIndex}
                        onChange={handleTabbarChange}
                    />
                ) : (
                    <div className="tabbar">明细表</div>
                )}
                <br />
                {dataSource && dataSource.length > 0 ? (
                    <Table
                        stickyLeftNum={selectIndex === 0 ? 2 : 0}
                        // 相同顺序
                        thList={selectIndex === 0 ? thAllList : thList}
                        // 不同顺序(使用相同顺序时把tabKey给删除)
                        // thList={thInfo[tabKey]}
                        tdList={dataSource}
                        height="80vh"
                    />
                ) : (
                    <EmptyView emptyType={EmptyType.emptyTypeNone} />
                )}

                {dataSource && dataSource.length > 0 && +selectIndex === 1 && (
                    <TipText className="tip-text" text={tipText(data['brief'] || 0)} size="12px" />
                )}

                {dataSource && dataSource.length > 0 && (
                    <ExportButton onExport={handleExportChange} />
                )}
            </div>
        );
    })
);

export default GroupPurchase;
