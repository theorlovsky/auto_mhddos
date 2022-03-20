export const TARGETS_URL = 'https://raw.githubusercontent.com/Aruiem234/auto_mhddos/main/runner_targets';

export const MILLISECOND = 1;

export const SECOND = MILLISECOND * 1000;

export const MINUTE = SECOND * 60;

export const ACTIVE_UDP_TARGETS_REGEX = /^(?!#)(?=.*udp.*).+?$/gim;

export const ACTIVE_NON_UDP_TARGETS_REGEX = /^(?!#)(?!.*udp.*).+?$/gim;
