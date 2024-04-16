import type {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import ScreenWrapper from '@components/ScreenWrapper';
import type {CentralPaneNavigatorParamList} from '@libs/Navigation/types';
import type SCREENS from '@src/SCREENS';
import SearchResults from './SearchResults';
import useCustomBackHandler from './useCustomBackHandler';

type SearchPageProps = StackScreenProps<CentralPaneNavigatorParamList, typeof SCREENS.SEARCH.CENTRAL_PANE>;

function SearchPage({route}: SearchPageProps) {
    useCustomBackHandler();

    return (
        <ScreenWrapper testID="testPage">
            <SearchResults query={route.params.query} />
        </ScreenWrapper>
    );
}

SearchPage.displayName = 'SearchPage';

export default SearchPage;
