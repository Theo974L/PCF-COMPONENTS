import * as React from 'react';
import { toast, ToastContainer, ToastPosition, TypeOptions, ToastContent } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { INotifyProps } from './interfaces';

const toastPositionMap: Record<string, ToastPosition> = {
    'haut gauche': 'top-left',
    'haut droit': 'top-right',
    'bas gauche': 'bottom-left',
    'bas droit': 'bottom-right',
    'centre haut': 'top-center',
    'centre bas': 'bottom-center',
    'top-left': 'top-left',
    'top-right': 'top-right',
    'bottom-left': 'bottom-left',
    'bottom-right': 'bottom-right',
    'top-center': 'top-center',
    'bottom-center': 'bottom-center'
};

const normalizeType = (type: string): TypeOptions => {
    const normalized = type?.trim().toLowerCase();
    switch (normalized) {
        case 'success':
            return 'success';
        case 'warning':
        case 'warn':
            return 'warning';
        case 'error':
        case 'alert':
            return 'error';
        case 'info':
        default:
            return 'info';
    }
};

const normalizeTheme = (theme: string) => {
    const normalized = theme?.trim().toLowerCase();
    switch (normalized) {
        case 'light':
            return 'light';
        case 'dark':
            return 'dark';
        case 'colored':
        default:
            return 'colored';
    }
};

const normalizePosition = (position: string) => {
    const key = position?.trim().toLowerCase() || 'top-right';
    return toastPositionMap[key] || 'top-right';
};

const parseBoolean = (value: string | undefined, defaultValue: boolean) => {
    if (typeof value !== 'string') {
        return defaultValue;
    }

    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
        return true;
    }
    if (normalized === 'false') {
        return false;
    }

    return defaultValue;
};

const buildContent = (
    title: string,
    icon: string,
    message: string
): ToastContent => {
    if (!title && !icon) {
        return message || 'Notification sans message';
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {icon ? <span>{icon}</span> : null}
                {title ? <strong>{title}</strong> : null}
            </div>
            <div>{message || 'Notification sans message'}</div>
        </div>
    );
};

export const NotifyComponent: React.FC<INotifyProps> = ({
    notificationType,
    notificationTitle,
    notificationMessage,
    notificationIcon,
    notificationPosition,
    notificationTheme,
    notificationCloseOnClick,
    notificationPauseOnHover,
    notificationHideProgressBar,
    notificationActionUrl,
    notificationTrigger,
    notificationAutoClose
}) => {
    const lastTriggerRef = React.useRef<string>('');

    React.useEffect(() => {
        if (!notificationTrigger) {
            return;
        }

        if (lastTriggerRef.current === notificationTrigger) {
            return;
        }

        lastTriggerRef.current = notificationTrigger;

        const message = notificationMessage?.trim() ?? '';
        const title = notificationTitle?.trim() ?? '';
        const icon = notificationIcon?.trim() ?? '';
        const type = normalizeType(notificationType);
        const position = normalizePosition(notificationPosition);
        const theme = normalizeTheme(notificationTheme);
        const closeOnClick = parseBoolean(notificationCloseOnClick, true);
        const pauseOnHover = parseBoolean(notificationPauseOnHover, true);
        const hideProgressBar = parseBoolean(notificationHideProgressBar, false);
        const autoClose = notificationAutoClose > 0 ? notificationAutoClose : 5000;
        const actionUrl = notificationActionUrl?.trim() || undefined;

        toast(buildContent(title, icon, message), {
            type,
            position,
            theme,
            autoClose,
            hideProgressBar,
            closeOnClick,
            pauseOnHover,
            draggable: true,
            progress: undefined,
            onClick: actionUrl
                ? () => {
                      window.open(actionUrl, '_blank');
                  }
                : undefined
        });
    }, [
        notificationTrigger,
        notificationMessage,
        notificationTitle,
        notificationIcon,
        notificationType,
        notificationPosition,
        notificationTheme,
        notificationCloseOnClick,
        notificationPauseOnHover,
        notificationHideProgressBar,
        notificationActionUrl,
        notificationAutoClose
    ]);

    return (
        <div className="notify-root" style={{ padding: 0 }}>
            <ToastContainer />
        </div>
    );
};