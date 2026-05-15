import AntDesign from '@react-native-vector-icons/ant-design';
import EvilIcons from '@react-native-vector-icons/evil-icons';
import Feather from '@react-native-vector-icons/feather';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';

import { CustomIconProps, GenericIconComponent } from '../../types/ui';


export const Icon = {
    Feather,
    Ionicons,
    EvilIcons,
    AntDesign,
    MaterialIcons,
};

export function AppIcon({
    library = 'Feather',
    name,
    size = 20,
    color = 'currentColor',
    style,
    ...rest
}: CustomIconProps) {
    const SelectedIcon = (Icon[library] ?? Icon.Feather) as GenericIconComponent;

    return (
        <SelectedIcon
            name={name}
            size={size}
            color={color}
            style={style}
            {...rest}
        />
    );
}

export default AppIcon;