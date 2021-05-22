import { MouseEvent, useState } from 'react'
import {
  Badge,
  ClickAwayListener,
  Divider,
  Fade,
  IconButton,
  MenuItem,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core'
import { Notifications } from '@material-ui/icons'

import useStyles from '@styles/components/notificationMenu'
import useSWR, { trigger } from 'swr'
import { useRouter } from 'next/router'
import { axiosInstance } from '@lib'

const NotificationMenu = () => {
  const { data: notifApi } = useSWR(`/api/notification`)
  const [arrowRef, setArrowRef] = useState<HTMLSpanElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)

  const handleClickOpenNotif = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
    setOpen(true)
  }
  const handleClickCloseNotif = () => {
    setOpen(false)
  }
  const modifiers = [
    {
      name: 'arrow',
      enabled: true,
      options: {
        element: arrowRef,
      },
    },
  ]

  const handleReadNotification = async (id: number, url: string) => {
    router.push(url)
    try {
      await axiosInstance.post('/api/notification/' + id)
      trigger('/api/notification')
    } catch (err) {
      console.error(err)
    }
  }

  const handleReadAllNotification = async () => {
    try {
      await axiosInstance.post('/api/notification')
      trigger('/api/notification')
    } catch (err) {
      console.error(err)
    }
  }

  const classes = useStyles()
  const router = useRouter()
  return (
    <>
      <IconButton
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => handleClickOpenNotif(e)}
      >
        <Badge
          badgeContent={!notifApi?.length ? 0 : notifApi?.length}
          color="secondary"
        >
          <Notifications />
        </Badge>
      </IconButton>
      <Popper
        transition
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        modifiers={modifiers}
        className={classes.popper}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className={classes.paperRoot} variant="outlined">
              <ClickAwayListener onClickAway={handleClickCloseNotif}>
                <div>
                  <span className={classes.arrow} ref={setArrowRef} />
                  <div className={classes.content}>
                    <div className={classes.notifHeader}>
                      <Typography
                        gutterBottom
                        display="inline"
                        fontWeight={600}
                        variant="subtitle1"
                      >
                        Notifications
                      </Typography>
                    </div>
                    <Divider />
                    <div className={classes.notificationList}>
                      {notifApi?.length <= 0 ? (
                        <Typography variant="body2" align="center">
                          You have 0 notifications
                        </Typography>
                      ) : (
                        notifApi?.map((item: any) => (
                          <div key={item.id}>
                            <MenuItem
                              sx={{ display: 'block' }}
                              disabled={!item.url ? true : false}
                              onClick={() =>
                                handleReadNotification(item.id ,item.url)
                              }
                            >
                              <Typography
                                gutterBottom
                                align="right"
                                variant="subtitle2"
                                whiteSpace="break-spaces"
                              >
                                {item.message}
                              </Typography>
                              <Typography
                                variant="body2"
                                className={classes.timestamp}
                              >
                                {new Date(item.createdAt).toDateString()}
                              </Typography>
                            </MenuItem>
                            <Divider variant="middle" />
                          </div>
                        ))
                      )}
                    </div>
                    <Typography
                      variant="body2"
                      color="primary"
                      className={classes.mark}
                      onClick={() => handleReadAllNotification()}
                    >
                      mark as all read
                    </Typography>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default NotificationMenu
