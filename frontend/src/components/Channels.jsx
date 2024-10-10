import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { setActiveChannelId, setActiveChannelMenuId } from '../slices/channelsSlice.jsx';
import { setChannelMenu, setIsOpenModal, setModalType } from '../slices/modalSlice.jsx';

export const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels);
  const modal = useSelector((state) => state.modal);
  const activeChannelId = useSelector(
    (state) => state.channels.activeChannelId,
  );

  const handleChoose = (e) => {
    dispatch(setActiveChannelId(e.target.id));
  };

  const handleChannelMenu = (e) => {
    dispatch(setChannelMenu(!modal.channelMenu));
    dispatch(setActiveChannelMenuId(e.target.id));
  };

  const handleDeleteChannel = () => {
    dispatch(setIsOpenModal(true));
    dispatch(setModalType('delete'));
    dispatch(setChannelMenu(false));
  };

  const handleRenameChannel = () => {
    dispatch(setIsOpenModal(true));
    dispatch(setModalType('rename'));
    dispatch(setChannelMenu(false));
  };

  return (
    channels.ids.length >= 1
    && channels.ids.map((id) => {
      const { channelMenu } = modal;
      const activeMenuId = channels.activeChannelMenuId;
      const channelClass = cn('w-100 rounded-0 text-start btn', {
        'btn-secondary': id === activeChannelId,
      });
      const groupClass = cn('d-flex dropdown btn-group', {
        show: channelMenu && activeMenuId === id,
      });
      const menuClass = cn('dropdown-menu', {
        show: channelMenu && activeMenuId === id,
      });
      const channelMenuClass = cn(
        'flex-grow-0 dropdown-toggle dropdown-toggle-split btn',
        {
          'btn-secondary': id === activeChannelId,
        },
      );
        if (!channels.entities[id].removable) {
          return (
            <li className="nav-item w-100" key={id}>
              <button
                type="button"
                className={channelClass}
                onClick={handleChoose}
                id={id}
              >
                <span className="me-1">{t('mainPage.grid')}</span>
                {channels.entities[id].name}
              </button>
            </li>
          );
      }
      return (
        <li className="nav-item w-100" key={id}>
          <div role="group" className={groupClass}>
            <button
              type="button"
              className={channelClass}
              onClick={handleChoose}
              id={id}
            >
              <span className="me-1">{t('mainPage.grid')}</span>
              {channels.entities[id].name}
            </button>
            <button
              type="button"
              id={id}
              aria-expanded={channelMenu}
              className={channelMenuClass}
              onClick={handleChannelMenu}
            >
              <span className="visually-hidden">
                {t('mainPage.channelManage')}
              </span>
            </button>
            <div
              x-placement="bottom-end"
              aria-labelledby="react-aria8879752112-:r0:"
              className={menuClass}
              data-popper-reference-hidden="false"
              data-popper-escaped="false"
              data-popper-placement="bottom-end"
              style={{
                position: 'absolute',
                inset: '0px 0px auto auto',
                transform: 'translate(0px, 40px)',
              }}
            >
              <a
                onClick={handleDeleteChannel}
                data-rr-ui-dropdown-item=""
                className="dropdown-item"
                role="button"
                tabIndex="0"
                href="#"
              >
                {t('mainPage.deleteChannel')}
              </a>
              <a
                onClick={handleRenameChannel}
                data-rr-ui-dropdown-item=""
                className="dropdown-item"
                role="button"
                tabIndex="0"
                href="#"
              >
                {t('mainPage.renameChannel')}
              </a>
            </div>
          </div>
        </li>
      );
    })
  );
};
