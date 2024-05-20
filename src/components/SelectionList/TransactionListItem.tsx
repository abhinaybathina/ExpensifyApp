import React from 'react';
import {View} from 'react-native';
import type {OnyxEntry} from 'react-native-onyx';
import Button from '@components/Button';
import Icon from '@components/Icon';
import * as Expensicons from '@components/Icon/Expensicons';
import {PressableWithFeedback} from '@components/Pressable';
import TextWithTooltip from '@components/TextWithTooltip';
import useLocalize from '@hooks/useLocalize';
import useStyleUtils from '@hooks/useStyleUtils';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import useWindowDimensions from '@hooks/useWindowDimensions';
import * as CurrencyUtils from '@libs/CurrencyUtils';
import * as TransactionUtils from '@libs/TransactionUtils';
import CONST from '@src/CONST';
import type {Transaction} from '@src/types/onyx';
import type {SearchTransactionType} from '@src/types/onyx/SearchResults';
import BaseListItem from './BaseListItem';
import ExpenseItemHeader from './ExpenseItemHeader';
import TextWithIconCell from './TextWithIconCell';
import type {ListItem, TransactionListItemProps, TransactionListItemType} from './types';
import UserInfoCell from './UserInfoCell';

const getTypeIcon = (type?: SearchTransactionType) => {
    switch (type) {
        case CONST.SEARCH_TRANSACTION_TYPE.CASH:
            return Expensicons.Cash;
        case CONST.SEARCH_TRANSACTION_TYPE.CARD:
            return Expensicons.CreditCard;
        case CONST.SEARCH_TRANSACTION_TYPE.DISTANCE:
            return Expensicons.Car;
        default:
            return Expensicons.Cash;
    }
};

function TransactionListItem<TItem extends ListItem>({
    item,
    isFocused,
    showTooltip,
    isDisabled,
    canSelectMultiple,
    onSelectRow,
    onDismissError,
    shouldPreventDefaultFocusOnSelectRow,
    onFocus,
    shouldSyncFocus,
}: TransactionListItemProps<TItem>) {
    const transactionItem = item as unknown as TransactionListItemType;
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const theme = useTheme();
    const {isLargeScreenWidth} = useWindowDimensions();
    const StyleUtils = useStyleUtils();

    function getMerchant() {
        const merchant = TransactionUtils.getMerchant(transactionItem as OnyxEntry<Transaction>);
        return merchant === CONST.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT || merchant === CONST.TRANSACTION.DEFAULT_MERCHANT ? '' : merchant;
    }

    const isFromExpenseReport = transactionItem.reportType === CONST.REPORT.TYPE.EXPENSE;
    const date = TransactionUtils.getCreated(transactionItem as OnyxEntry<Transaction>, CONST.DATE.MONTH_DAY_ABBR_FORMAT);
    const amount = TransactionUtils.getAmount(transactionItem as OnyxEntry<Transaction>, isFromExpenseReport);
    const taxAmount = TransactionUtils.getTaxAmount(transactionItem as OnyxEntry<Transaction>, isFromExpenseReport);
    const currency = TransactionUtils.getCurrency(transactionItem as OnyxEntry<Transaction>);
    const description = TransactionUtils.getDescription(transactionItem as OnyxEntry<Transaction>);
    const merchant = getMerchant();
    const typeIcon = getTypeIcon(transactionItem.type);

    const dateCell = (
        <TextWithTooltip
            shouldShowTooltip={showTooltip}
            text={date}
            style={[styles.label, styles.pre, styles.justifyContentCenter, isLargeScreenWidth ? undefined : [styles.textMicro, styles.textSupporting]]}
        />
    );

    const merchantCell = (
        <TextWithTooltip
            shouldShowTooltip={showTooltip}
            text={transactionItem.shouldShowMerchant ? merchant : description}
            style={[styles.optionDisplayName, styles.label, styles.pre, styles.justifyContentCenter]}
        />
    );

    const categoryCell = isLargeScreenWidth ? (
        <TextWithTooltip
            shouldShowTooltip={showTooltip}
            text={transactionItem?.category}
            style={[styles.optionDisplayName, styles.label, styles.pre, styles.justifyContentCenter]}
        />
    ) : (
        <TextWithIconCell
            icon={Expensicons.Folder}
            showTooltip={showTooltip}
            text={transactionItem?.category}
        />
    );

    const tagCell = isLargeScreenWidth ? (
        <TextWithTooltip
            shouldShowTooltip={showTooltip}
            text={transactionItem?.tag}
            style={[styles.optionDisplayName, styles.label, styles.pre, styles.justifyContentCenter]}
        />
    ) : (
        <TextWithIconCell
            icon={Expensicons.Tag}
            showTooltip={showTooltip}
            text={transactionItem?.tag}
        />
    );

    const taxCell = (
        <TextWithTooltip
            shouldShowTooltip={showTooltip}
            text={CurrencyUtils.convertToDisplayString(taxAmount, currency)}
            style={[styles.optionDisplayName, styles.label, styles.pre, styles.justifyContentCenter, styles.textAlignRight]}
        />
    );

    const totalCell = (
        <TextWithTooltip
            shouldShowTooltip={showTooltip}
            text={CurrencyUtils.convertToDisplayString(amount, currency)}
            style={[styles.optionDisplayName, styles.textNewKansasNormal, styles.pre, styles.justifyContentCenter, isLargeScreenWidth ? undefined : styles.textAlignRight]}
        />
    );

    const typeCell = (
        <Icon
            src={typeIcon}
            fill={theme.icon}
            height={isLargeScreenWidth ? 20 : 12}
            width={isLargeScreenWidth ? 20 : 12}
        />
    );

    const actionCell = (
        <Button
            text={translate('common.view')}
            onPress={() => {
                onSelectRow(item);
            }}
            small
            pressOnEnter
            style={[styles.p0]}
        />
    );

    const listItemPressableStyle = [styles.selectionListPressableItemWrapper, styles.pv3, item.isSelected && styles.activeComponentBG, isFocused && styles.sidebarLinkActive];

    if (!isLargeScreenWidth) {
        return (
            <BaseListItem
                item={item}
                pressableStyle={listItemPressableStyle}
                wrapperStyle={[styles.flexColumn, styles.flex1, styles.userSelectNone, styles.alignItemsStretch]}
                containerStyle={[styles.mb3]}
                isFocused={isFocused}
                isDisabled={isDisabled}
                showTooltip={showTooltip}
                canSelectMultiple={canSelectMultiple}
                onSelectRow={onSelectRow}
                onDismissError={onDismissError}
                shouldPreventDefaultFocusOnSelectRow={shouldPreventDefaultFocusOnSelectRow}
                errors={item.errors}
                pendingAction={item.pendingAction}
                keyForList={item.keyForList}
                onFocus={onFocus}
                shouldSyncFocus={shouldSyncFocus}
                hoverStyle={item.isSelected && styles.activeComponentBG}
            >
                {() => (
                    <>
                        <ExpenseItemHeader
                            participantFrom={transactionItem.from}
                            participantTo={transactionItem.to}
                            buttonText={translate('common.view')}
                            onButtonPress={() => {
                                onSelectRow(item);
                            }}
                        />
                        <View style={[styles.flexRow, styles.justifyContentBetween, styles.gap1]}>
                            <View style={[styles.flex2, styles.gap1]}>
                                {merchantCell}
                                <View style={[styles.flexRow, styles.flex1, styles.alignItemsEnd, styles.gap3]}>
                                    {categoryCell}
                                    {tagCell}
                                </View>
                            </View>
                            <View style={[styles.alignItemsEnd, styles.flex1, styles.gap1]}>
                                {totalCell}
                                <View style={[styles.flexRow, styles.gap1, styles.justifyContentCenter]}>
                                    {typeCell}
                                    {dateCell}
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </BaseListItem>
        );
    }

    return (
        <BaseListItem
            item={item}
            pressableStyle={listItemPressableStyle}
            wrapperStyle={[styles.flexRow, styles.flex1, styles.justifyContentBetween, styles.userSelectNone, styles.alignItemsCenter]}
            containerStyle={[styles.mb3]}
            isFocused={isFocused}
            isDisabled={isDisabled}
            showTooltip={showTooltip}
            canSelectMultiple={canSelectMultiple}
            onSelectRow={onSelectRow}
            onDismissError={onDismissError}
            shouldPreventDefaultFocusOnSelectRow={shouldPreventDefaultFocusOnSelectRow}
            errors={item.errors}
            pendingAction={item.pendingAction}
            keyForList={item.keyForList}
            onFocus={onFocus}
            shouldSyncFocus={shouldSyncFocus}
            hoverStyle={item.isSelected && styles.activeComponentBG}
        >
            {() => (
                <View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter]}>
                    {canSelectMultiple && (
                        <PressableWithFeedback
                            accessibilityLabel={item.text ?? ''}
                            role={CONST.ROLE.BUTTON}
                            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                            disabled={isDisabled || item.isDisabledCheckbox}
                            onPress={() => {}}
                            style={[styles.cursorUnset, StyleUtils.getCheckboxPressableStyle(), item.isDisabledCheckbox && styles.cursorDisabled]}
                        >
                            <View style={[StyleUtils.getCheckboxContainerStyle(20), StyleUtils.getMultiselectListStyles(!!item.isSelected, !!item.isDisabled)]}>
                                {item.isSelected && (
                                    <Icon
                                        src={Expensicons.Checkmark}
                                        fill={theme.textLight}
                                        height={14}
                                        width={14}
                                    />
                                )}
                            </View>
                        </PressableWithFeedback>
                    )}
                    <View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.ph4, styles.gap3]}>
                        <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.DATE)]}>{dateCell}</View>
                        <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.MERCHANT)]}>{merchantCell}</View>
                        <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.FROM)]}>
                            <UserInfoCell participant={transactionItem.from} />
                        </View>
                        <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.TO)]}>
                            <UserInfoCell participant={transactionItem.to} />
                        </View>
                        {transactionItem.shouldShowCategory && <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.CATEGORY)]}>{categoryCell}</View>}
                        {transactionItem.shouldShowTag && <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.TAG)]}>{tagCell}</View>}
                        {transactionItem.shouldShowTax && <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.TAX_AMOUNT)]}>{taxCell}</View>}
                        <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.TOTAL)]}>{totalCell}</View>
                        <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.TYPE)]}>{typeCell}</View>
                        <View style={[StyleUtils.getSearchTableColumnStyles(CONST.SEARCH_TABLE_COLUMNS.ACTION)]}>{actionCell}</View>
                    </View>
                </View>
            )}
        </BaseListItem>
    );
}

TransactionListItem.displayName = 'TransactionListItem';

export default TransactionListItem;
