import React, { useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAtom } from 'jotai'
import { useMedia } from 'react-use'
import {
  type AnimatedProp,
  Animated,
  Animator,
  styleFrameClipOctagon,
  cx,
  flicker,
  Illuminator,
  memo,
  transition,
  useBleeps
} from '@arwes/react'
import {
  X,
  Page,
  Codepen,
  Settings,
  CollageFrame,
  DashboardSpeed,
  Github,
  Discord,
  Keyframes,
  KeyframesMinus,
  SoundHigh,
  SoundOff,
  Heart,
  AtSign,
  Menu as MenuIcon
} from 'iconoir-react'

import { type BleepNames, atomAudioEnabled, atomMotionEnabled, settings, theme } from '@/config'
import { ArwesLogoIcon } from '../ArwesLogoIcon'
import { ArwesLogoType } from '../ArwesLogoType'
import { Menu } from '../Menu'
import { MenuItem } from '../MenuItem'
import { Modal } from '../Modal'
import { MobileNav } from './MobileNav'
import { MobileLinks } from './MobileLinks'
import styles from './Header.module.css'

interface HeaderProps {
  className?: string
  animated?: AnimatedProp
}

const Header = memo((props: HeaderProps): JSX.Element => {
  const { className, animated } = props

  const pathname = usePathname()
  const [isMotionEnabled, setIsMotionEnabled] = useAtom(atomMotionEnabled)
  const [isAudioEnabled, setIsAudioEnabled] = useAtom(atomAudioEnabled)
  const isMD = useMedia(theme.breakpoints.up('md', { strip: true }), false)
  const isXL = useMedia(theme.breakpoints.up('xl', { strip: true }), false)
  const bleeps = useBleeps<BleepNames>()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const openMenu = useCallback(() => {
    setIsMenuOpen(true)
    bleeps.click?.play()
  }, [])
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    bleeps.click?.play()
  }, [])

  const isIndex = pathname === '/'

  return (
    <Animated
      as="header"
      className={cx('flex justify-center items-center select-none', styles.root, className)}
      animated={animated}
    >
      <div className={cx('flex-1 flex px-2', 'md:px-4 md:py-2', 'xl:px-8')}>
        <div className={cx('relative flex-1 flex px-4', 'xl:px-4')}>
          {/* BACKGROUND */}
          {!isIndex && isXL && (
            <div
              role="presentation"
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: styleFrameClipOctagon({ squareSize: theme.space(2) })
              }}
            >
              <Illuminator color={theme.colors.primary.main(3, { alpha: 0.1 })} size={400} />
            </div>
          )}

          {/* LEFT PANEL */}
          <div className="relative flex-1 flex flex-row justify-between items-center">
            <Animator combine manager="stagger" refreshOn={[isIndex, isMD]}>
              <Animated
                className="flex flex-row gap-4"
                animated={transition('x', theme.spacen(4), 0, 0)}
              >
                <Link className={styles.logo} href="/" onClick={() => bleeps.click?.play()}>
                  <h1
                    className="flex flex-row justify-center items-center gap-2 h-[3rem]"
                    title={settings.title}
                  >
                    <Animator>
                      <ArwesLogoIcon
                        className={cx('w-6 h-6', styles.logoImage)}
                        animated={flicker()}
                      />
                    </Animator>

                    <Animator
                      merge
                      condition={!isIndex && isMD}
                      unmountOnExited
                      unmountOnDisabled={isIndex || !isMD}
                    >
                      <ArwesLogoType className="h-4" animated={flicker()} />
                    </Animator>
                  </h1>
                </Link>

                <Animator
                  combine
                  manager="stagger"
                  condition={!isIndex}
                  unmountOnExited
                  unmountOnDisabled={isIndex}
                >
                  <Menu className="h-[3rem]">
                    <Animator>
                      <MenuItem active={pathname.startsWith('/docs')} animated={flicker()}>
                        <Link href="/docs" title="Go to Documentation">
                          <Page /> <span className="hidden lg:block">Docs</span>
                        </Link>
                      </MenuItem>
                    </Animator>
                    <Animator>
                      <MenuItem active={pathname.startsWith('/demos')} animated={flicker()}>
                        <Link href="/demos" title="Go to Demos">
                          <CollageFrame /> <span className="hidden lg:block">Demos</span>
                        </Link>
                      </MenuItem>
                    </Animator>
                    <Animator>
                      <MenuItem active={pathname.startsWith('/play')} animated={flicker()}>
                        <a href="/play" title="Go to Playground">
                          <Codepen /> <span className="hidden lg:block">Play</span>
                        </a>
                      </MenuItem>
                    </Animator>
                    <Animator>
                      <MenuItem active={pathname.startsWith('/perf')} animated={flicker()}>
                        <a href="/perf" title="Go to Performance">
                          <DashboardSpeed /> <span className="hidden lg:block">Perf</span>
                        </a>
                      </MenuItem>
                    </Animator>
                  </Menu>
                </Animator>
              </Animated>
            </Animator>

            {/* RIGHT PANEL */}
            <Animator combine manager="switch" refreshOn={[isMD]}>
              <Animator
                combine
                manager="staggerReverse"
                condition={!isMD}
                unmountOnExited
                unmountOnDisabled={isMD}
              >
                <Animated
                  as="nav"
                  className="flex flex-row gap-4"
                  animated={transition('x', -theme.spacen(2), 0, 0)}
                >
                  <Menu className="h-[3rem]">
                    <Animator>
                      <MenuItem animated={flicker()}>
                        <button>
                          <Settings />
                        </button>
                      </MenuItem>
                    </Animator>
                    <Animator>
                      <MenuItem animated={flicker()}>
                        <button onClick={openMenu}>
                          <MenuIcon />
                        </button>
                      </MenuItem>
                    </Animator>
                  </Menu>
                </Animated>
              </Animator>

              <Animator
                combine
                manager="staggerReverse"
                condition={isMD}
                unmountOnExited
                unmountOnDisabled={!isMD}
              >
                <Animated
                  as="nav"
                  className="flex flex-row gap-4"
                  animated={transition('x', -theme.spacen(4), 0, 0)}
                >
                  <Menu className="h-[3rem]">
                    <Animator>
                      <MenuItem className="group hover:!text-fuchsia-300" animated={flicker()}>
                        <a
                          className="!gap-0 group-hover:text-fuchsia-300"
                          href="https://github.com/sponsors/romelperez"
                          target="sponsor"
                        >
                          <Heart />
                          <div
                            className={cx(
                              'grid grid-flow-row grid-cols-[0fr]',
                              'transition-all ease-out duration-200',
                              'group-hover:grid-cols-[1fr] group-hover:pl-2'
                            )}
                          >
                            <div className="overflow-hidden">Sponsor</div>
                          </div>
                        </a>
                      </MenuItem>
                    </Animator>
                    <Animator>
                      <MenuItem animated={flicker()}>
                        <a
                          href="https://github.com/arwes/arwes"
                          target="github"
                          title="Go to Github"
                        >
                          <Github />
                        </a>
                      </MenuItem>
                    </Animator>
                    <Animator>
                      <MenuItem animated={flicker()}>
                        <a href="https://x.com/arwesjs" target="twitter" title="Go to X (Twitter)">
                          <X />
                        </a>
                      </MenuItem>
                    </Animator>
                    <Animator>
                      <MenuItem animated={flicker()}>
                        <a href="https://discord.gg/s5sbTkw" target="discord" title="Go to Discord">
                          <Discord />
                        </a>
                      </MenuItem>
                    </Animator>
                    <Animator>
                      <MenuItem animated={flicker()}>
                        <a
                          href={`https://github.com/arwes/arwes/releases/tag/v${settings.version}`}
                          target="version"
                          title={`v${settings.version} (${new Date(settings.deployTime).toString()})`}
                        >
                          <AtSign />
                        </a>
                      </MenuItem>
                    </Animator>
                  </Menu>

                  <Menu className="h-[3rem]">
                    <Animator>
                      <MenuItem animated={flicker()}>
                        <button
                          title={isMotionEnabled ? 'Disable motion' : 'Enable motion'}
                          onClick={() => setIsMotionEnabled(!isMotionEnabled)}
                        >
                          {isMotionEnabled ? <Keyframes /> : <KeyframesMinus />}
                        </button>
                      </MenuItem>
                    </Animator>
                    <Animator>
                      <MenuItem animated={flicker()}>
                        <button
                          title={isAudioEnabled ? 'Disable audio' : 'Enable audio'}
                          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        >
                          {isAudioEnabled ? <SoundHigh /> : <SoundOff />}
                        </button>
                      </MenuItem>
                    </Animator>
                  </Menu>
                </Animated>
              </Animator>
            </Animator>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <Animator root active={isMenuOpen} unmountOnExited unmountOnDisabled={!isMenuOpen}>
        <Modal contentClassName="flex flex-col gap-6 min-h-40" header="Index" onClose={closeMenu}>
          <Animator combine manager="stagger">
            <MobileNav onLink={closeMenu} />

            <div className="flex flex-col gap-2">
              <MobileLinks />

              <Animator>
                <Animated<HTMLAnchorElement>
                  as="a"
                  className="flex justify-center font-cta font-light leading-none text-size-10 text-primary-main-9"
                  animated={flicker()}
                  href={`https://github.com/arwes/arwes/releases/tag/v${settings.version}`}
                  target="version"
                >
                  v{settings.version}
                </Animated>
              </Animator>

              <Animator>
                <Animated
                  className="flex justify-center font-cta font-light leading-none text-size-11 text-primary-main-9"
                  animated={flicker()}
                >
                  {new Date(settings.deployTime).toISOString()}
                </Animated>
              </Animator>
            </div>
          </Animator>
        </Modal>
      </Animator>
    </Animated>
  )
})

export { Header }
