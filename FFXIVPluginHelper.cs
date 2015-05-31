// From https://github.com/xtuaok/ACT_EnmityPlugin/
//
// Copyright (c) 2015 Tomonori Tamagawa
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using System.Text.RegularExpressions;
using Advanced_Combat_Tracker;
using System.Runtime.InteropServices;


namespace Cactbot
{
    public static class FFXIVPluginHelper
    {
        private static Regex regVersion = new Regex(@"FileVersion: (?<version>\d+\.\d+\.\d+\.\d+)\n", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static ActPluginData _plugin = null;

        static class NativeMethods
        {
            // ReadProcessMemory
            [DllImport("kernel32.dll")]
            public static extern bool ReadProcessMemory(IntPtr hProcess, IntPtr lpBaseAddress, byte[] lpBuffer, IntPtr nSize, ref IntPtr lpNumberOfBytesRead);
        }

        public static ActPluginData Instance
        {
            get
            {
                if (_plugin == null && ActGlobals.oFormActMain.Visible)
                {
                    foreach (ActPluginData plugin in ActGlobals.oFormActMain.ActPlugins)
                    {
                        if (plugin.pluginFile.Name == "FFXIV_ACT_Plugin.dll" && plugin.lblPluginStatus.Text == "FFXIV Plugin Started.")
                        {
                            _plugin = plugin;
                            break;
                        }
                    }
                }
                return _plugin;
            }
        }

        public static Version GetVersion
        {
            get
            {
                if (_plugin != null)
                {
                    return new Version(regVersion.Match(_plugin.pluginVersion).Groups["version"].ToString());
                }
                return null;
            }
        }

        public static Process GetFFXIVProcess
        {
            get
            {
                try
                {
                    FieldInfo fi = _plugin.pluginObj.GetType().GetField("_Memory", BindingFlags.GetField | BindingFlags.NonPublic | BindingFlags.Instance);
                    var memory = fi.GetValue(_plugin.pluginObj);
                    if (memory == null) return null;

                    fi = memory.GetType().GetField("_config", BindingFlags.GetField | BindingFlags.NonPublic | BindingFlags.Instance);
                    var config = fi.GetValue(memory);
                    if (config == null) return null;

                    fi = config.GetType().GetField("Process", BindingFlags.GetField | BindingFlags.Public | BindingFlags.Instance);
                    var process = fi.GetValue(config);
                    if (process == null) return null;

                    return (Process)process;
                }
                catch
                {
                    return null;
                }
            }
        }

        private static object GetScanCombatants()
        {
            FieldInfo fi = Instance.pluginObj.GetType().GetField("_Memory", BindingFlags.GetField | BindingFlags.NonPublic | BindingFlags.Instance);
            var memory = fi.GetValue(Instance.pluginObj);
            if (memory == null) return null;

            fi = memory.GetType().GetField("_config", BindingFlags.GetField | BindingFlags.NonPublic | BindingFlags.Instance);
            var config = fi.GetValue(memory);
            if (config == null) return null;

            fi = config.GetType().GetField("ScanCombatants", BindingFlags.GetField | BindingFlags.NonPublic | BindingFlags.Instance);
            var scanCombatants = fi.GetValue(config);
            if (scanCombatants == null) return null;

            return scanCombatants;
        }

        private static void SetCombatantInfo(Combatant combatant, string propertyName, object obj, string fieldName)
        {
            FieldInfo fi = obj.GetType().GetField(fieldName, BindingFlags.Public | BindingFlags.Instance);
            PropertyInfo propertyInfo = combatant.GetType().GetProperty(propertyName);
            propertyInfo.SetValue(combatant, Convert.ChangeType(fi.GetValue(obj), propertyInfo.PropertyType), null);
        }

        public static List<Combatant> GetCombatantList()
        {
            List<Combatant> result = new List<Combatant>();
            try
            {
                var scanCombatants = GetScanCombatants();
                if (scanCombatants == null) return null;

                var item = scanCombatants.GetType().InvokeMember("GetCombatantList", BindingFlags.Public | BindingFlags.Instance | BindingFlags.InvokeMethod, null, scanCombatants, null);
                FieldInfo fi = item.GetType().GetField("_items", BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.GetField);

                Type[] nestedType = item.GetType().GetNestedTypes(BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Public);
                object tmp = fi.GetValue(item);
                if (tmp.GetType().IsArray)
                {
                    foreach (object temp in (Array)tmp)
                    {
                        if (temp == null)
                            break;

                        Combatant combatant = new Combatant();

                        SetCombatantInfo(combatant, "ID", temp, "ID");
                        SetCombatantInfo(combatant, "OwnerID", temp, "OwnerID");
                        SetCombatantInfo(combatant, "Job", temp, "Job");
                        SetCombatantInfo(combatant, "Name", temp, "Name");
                        SetCombatantInfo(combatant, "CurrentHP", temp, "CurrentHP");
                        SetCombatantInfo(combatant, "CurrentMP", temp, "CurrentMP");
                        SetCombatantInfo(combatant, "CurrentTP", temp, "CurrentTP");
                        SetCombatantInfo(combatant, "MaxHP", temp, "MaxHP");
                        SetCombatantInfo(combatant, "MaxMP", temp, "MaxMP");
                        SetCombatantInfo(combatant, "MaxTP", temp, "MaxTP");
                        SetCombatantInfo(combatant, "PosX", temp, "PosX");
                        SetCombatantInfo(combatant, "PosY", temp, "PosY");
                        SetCombatantInfo(combatant, "PosZ", temp, "PosZ");

                        result.Add(combatant);
                    }
                }
            }
            catch { }
            return result;
        }

        // <summary>
        // ターゲットの情報(とりあえず必要なものだけ)
        // </summary>
        //
        //
        public unsafe static TargetInfo GetTargetInfoFromByteArray(byte[] source)
        {

            TargetInfo target = new TargetInfo();

            target.Name = FFXIVPluginHelper.GetStringFromBytes(source, 48);

            fixed (byte* p = &source[0x74]) target.ID = *(uint*)p;

            target.Type = (TargetType)source[0x8A];
            target.EffectiveDistance = source[0x90];

            fixed (byte* p = &source[0xA0]) target.X = *(float*)p;
            fixed (byte* p = &source[0xA4]) target.Z = *(float*)p;
            fixed (byte* p = &source[0xA8]) target.Y = *(float*)p;

            if (target.Type != TargetType.PC && target.Type != TargetType.Monster)
            {
                target.CurrentHP = target.MaxHP = target.CurrentMP = target.MaxMP = 0;
            }
            else
            {
                fixed (byte* p = &source[0x1548]) target.CurrentHP = *(int*)p;
                fixed (byte* p = &source[0x154C]) target.MaxHP = *(int*)p;
                fixed (byte* p = &source[0x1550]) target.CurrentMP = *(int*)p;
                fixed (byte* p = &source[0x1554]) target.MaxMP = *(int*)p;
            }
            return target;
        }

        private static bool Peek(uint address, byte[] buffer)
        {
            Process process = GetFFXIVProcess;
            IntPtr zero = IntPtr.Zero;
            IntPtr nSize = new IntPtr(buffer.Length);
            return NativeMethods.ReadProcessMemory(process.Handle, new IntPtr(address), buffer, nSize, ref zero);
        }

        public static string GetStringFromBytes(byte[] source, int offset = 0, int size = 256)
        {
            var bytes = new byte[size];
            Array.Copy(source, offset, bytes, 0, size);
            var realSize = 0;
            for (var i = 0; i < size; i++)
            {
                if (bytes[i] != 0)
                {
                    continue;
                }
                realSize = i;
                break;
            }
            Array.Resize(ref bytes, realSize);
            return System.Text.Encoding.UTF8.GetString(bytes);
        }

        /// <summary>
        /// </summary>
        /// <param name="address"></param>
        /// <param name="length"></param>
        /// <returns></returns>
        public static byte[] GetByteArray(uint address, int length)
        {
            var data = new byte[length];
            Peek(address, data);
            return data;
        }

        /// <summary>
        /// </summary>
        /// <param name="address"></param>
        /// <param name="offset"></param>
        /// <returns></returns>
        public unsafe static int GetInt32(uint address, uint offset = 0)
        {
            int ret;
            var value = new byte[4];
            Peek(address + offset, value);
            fixed (byte* p = &value[0]) ret = *(int*)p;
            return ret;
        }

        /// <summary>
        /// </summary>
        /// <param name="address"></param>
        /// <param name="offset"></param>
        /// <returns></returns>
        public unsafe static uint GetUInt32(uint address, uint offset = 0)
        {
            uint ret;
            var value = new byte[4];
            Peek(address + offset, value);
            fixed (byte* p = &value[0]) ret = *(uint*)p;
            return ret;
        }

        //
        // Signature Sscan
        // 
        public static List<IntPtr> SigScan(string pattern, int offset = 0)
        {
            IntPtr arg_05_0 = IntPtr.Zero;
            if (pattern == null || pattern.Length % 2 != 0)
            {
                return new List<IntPtr>();
            }

            byte?[] array = new byte?[pattern.Length / 2];
            for (int i = 0; i < pattern.Length / 2; i++)
            {
                string text = pattern.Substring(i * 2, 2);
                if (text == "??")
                {
                    array[i] = null;
                }
                else
                {
                    array[i] = new byte?(Convert.ToByte(text, 16));
                }
            }

            int num = 4096;
            Process process = GetFFXIVProcess;

            int moduleMemorySize = process.MainModule.ModuleMemorySize;
            IntPtr baseAddress = process.MainModule.BaseAddress;
            IntPtr intPtr = IntPtr.Add(baseAddress, moduleMemorySize);
            IntPtr intPtr2 = baseAddress;
            byte[] array2 = new byte[num];
            List<IntPtr> list = new List<IntPtr>();
            while (intPtr2.ToInt64() < intPtr.ToInt64())
            {
                IntPtr zero = IntPtr.Zero;
                IntPtr nSize = new IntPtr(num);
                if (IntPtr.Add(intPtr2, num).ToInt64() > intPtr.ToInt64())
                {
                    nSize = (IntPtr)(intPtr.ToInt64() - intPtr2.ToInt64());
                }
                if (NativeMethods.ReadProcessMemory(process.Handle, intPtr2, array2, nSize, ref zero))
                {
                    int num2 = 0;
                    while ((long)num2 < zero.ToInt64() - (long)array.Length - (long)offset - 4L + 1L)
                    {
                        int num3 = 0;
                        for (int j = 0; j < array.Length; j++)
                        {
                            if (!array[j].HasValue)
                            {
                                num3++;
                            }
                            else
                            {
                                if (array[j].Value != array2[num2 + j])
                                {
                                    break;
                                }
                                num3++;
                            }
                        }
                        if (num3 == array.Length)
                        {
                            IntPtr item = new IntPtr(num2 + offset);
                            item = new IntPtr(intPtr2.ToInt64() + item.ToInt64());
                            list.Add(item);
                        }
                        num2++;
                    }
                }
                intPtr2 = IntPtr.Add(intPtr2, num);
            }
            return list;
        }
    }

    public enum TargetType : byte
    {
        Unknown = 0x0,
        PC = 0x01,
        Monster = 0x02,
        NPC = 0x03,
        Aetheryte = 0x05,
        Gathering = 0x06,
        Minion = 0x09
    }

    public class TargetInfo
    {
        public string Name;
        public uint ID;
        public int EffectiveDistance;
        public string Distance;
        public string HorizontalDistance;
        public float X;
        public float Y;
        public float Z;
        public TargetType Type;
        public int CurrentHP;
        public int MaxHP;
        public string HPPercent
        {
            get
            {
                try
                {
                    if (MaxHP == 0) return "0.00";
                    return (Convert.ToDouble(CurrentHP) / Convert.ToDouble(MaxHP) * 100).ToString("0.00");
                }
                catch
                {
                    return "0.00";
                }
            }
        }
        public int CurrentMP;
        public int MaxMP;
        public float GetDistanceTo(TargetInfo target)
        {
            var distanceX = (float)Math.Abs(X - target.X);
            var distanceY = (float)Math.Abs(Y - target.Y);
            var distanceZ = (float)Math.Abs(Z - target.Z);
            return (float)Math.Sqrt((distanceX * distanceX) + (distanceY * distanceY) + (distanceZ * distanceZ));
        }
        public float GetHorizontalDistanceTo(TargetInfo target)
        {
            var distanceX = (float)Math.Abs(X - target.X);
            var distanceY = (float)Math.Abs(Y - target.Y);
            return (float)Math.Sqrt((distanceX * distanceX) + (distanceY * distanceY));
        }
    }

    public class Combatant
    {
        public uint ID { get; set; }
        public uint OwnerID { get; set; }
        public int Order { get; set; }
        public byte type { get; set; }
        public int Job { get; set; }
        public int Level { get; set; }
        public string Name { get; set; }
        public int CurrentHP { get; set; }
        public int MaxHP { get; set; }
        public int CurrentMP { get; set; }
        public int MaxMP { get; set; }
        public int CurrentTP { get; set; }
        public int MaxTP { get; set; }
        public float PosX { get; set; }
        public float PosY { get; set; }
        public float PosZ { get; set; }
    }
}
