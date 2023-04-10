import { Group, Button, MantineProvider } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';

export function Demo() {
    return (
        <MantineProvider>
            <Notifications />
            <Group position="center">
                <Button
                    variant="outline"
                    onClick={() =>
                        notifications.show({
                            title: 'Default notification',
                            message: 'Hey there, your code is awesome! 🤥',
                            styles: (theme) => ({
                                root: {
                                    backgroundColor: theme.colors.blue[6],
                                    borderColor: theme.colors.blue[6],

                                    '&::before': { backgroundColor: theme.white },
                                },

                                title: { color: theme.white },
                                description: { color: theme.white },
                                closeButton: {
                                    color: theme.white,
                                    '&:hover': { backgroundColor: theme.colors.blue[7] },
                                },
                            }),
                        })
                    }
                >
                    Show customized notification
                </Button>
            </Group>
        </MantineProvider>
    );
}