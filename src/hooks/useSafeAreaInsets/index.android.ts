// eslint-disable-next-line no-restricted-imports
import {EdgeInsets, useSafeAreaInsets as useSafeAreaInsetsInternal} from 'react-native-safe-area-context';
import StatusBar from '@libs/StatusBar';

function useSafeAreaInsets(): EdgeInsets {
    const insets = useSafeAreaInsetsInternal();

    return {
        ...insets,
        top: StatusBar.currentHeight ?? insets.top,
    };
}

export default useSafeAreaInsets;
